import { StockForm, Stock, stockFormSchema } from "@/validations/stock-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateStock } from "../actions";
import { toast } from "sonner";
import { Preview } from "@/types/general";
import { Dialog } from "@/components/ui/dialog";
import { INITIAL_STATE_STOCK } from "@/constants/stock-constant";
import FormStock from "./form-stock";

export default function DialogUpdateStock({
  refetch,
  currentData,
  handleChangeAction,
  open,
}: {
  refetch: () => void;
  currentData?: Stock;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<StockForm>({
    resolver: zodResolver(stockFormSchema),
  });

  const [updateStockState, updateStockAction, isPendingUpdateStock] =
    useActionState(updateStock, INITIAL_STATE_STOCK);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    if (currentData?.image_url !== data.image_url) {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(
          key,
          key === "image_url" ? (preview!.file ?? "") : value,
        );
      });
      formData.append("old_image_url", currentData?.image_url ?? "");
    } else {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    formData.append("id", currentData?.id ?? "");

    startTransition(() => {
      updateStockAction(formData);
    });
  });

  useEffect(() => {
    if (updateStockState?.status === "error") {
      toast.error("Update Stock Failed", {
        description: updateStockState.errors?._form?.[0],
      });
    }

    if (updateStockState?.status === "success") {
      toast.success("Update Stock Success");
      form.reset();
      handleChangeAction?.(false);
      refetch();
    }
  }, [updateStockState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("nama", currentData.nama as string);
      form.setValue("deskripsi", currentData.deskripsi as string);
      form.setValue("harga_beli", currentData.harga_beli.toString());
      form.setValue("harga_jual", currentData.harga_jual.toString());
      form.setValue("kategori", currentData.kategori as string);
      form.setValue("jumlah", currentData.jumlah.toString());
      form.setValue("is_available", currentData.is_available.toString());
      form.setValue("image_url", currentData.image_url as string);
      setPreview({
        file: new File([], currentData.image_url as string),
        displayUrl: currentData.image_url as string,
      });
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormStock
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdateStock}
        type="Update"
        preview={preview}
        setPreview={setPreview}
      />
    </Dialog>
  );
}
