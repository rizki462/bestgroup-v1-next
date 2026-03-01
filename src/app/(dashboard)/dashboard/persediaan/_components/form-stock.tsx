"use client";

import { useEffect } from "react"; // Tambahkan useEffect
import FormImage from '@/components/common/form-image';
import FormInput from '@/components/common/form-input';
import FormSelect from '@/components/common/form-select';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { AVAILABLE_LIST } from '@/constants/auth-constant';
import { KATEGORI_LIST } from '@/constants/stock-constant';
import { Preview } from '@/types/general';
import { Loader2 } from 'lucide-react';
import { FormEvent } from 'react';
import { FieldValues, Path, UseFormReturn, useWatch } from 'react-hook-form'; // Tambahkan useWatch

export default function FormMenu<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: 'Create' | 'Update';
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}) {
  
  const jumlahWatch = useWatch({
    control: form.control,
    name: "jumlah" as Path<T>,
  });

  useEffect(() => {
    const currentJumlah = Number(jumlahWatch);
    if (currentJumlah <= 0) {
      form.setValue("is_available" as Path<T>, false as any);
    } else {
      form.setValue("is_available" as Path<T>, true as any);
    }
  }, [jumlahWatch, form]);

  return (
    <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
      <Form {...form}>
        <DialogHeader>
          <DialogTitle>{type} Stock Sparepart</DialogTitle>
          <DialogDescription>
            {type === "Create"
              ? "Tambahkan data stok barang baru ke sistem."
              : "Perbarui informasi detail stok yang sudah ada."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <FormInput
            form={form}
            name={"nama" as Path<T>}
            label="Nama Barang"
            placeholder="Contoh: Keyboard Asus X441"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              form={form}
              name={"kategori" as Path<T>}
              label="Kategori"
              selectItem={KATEGORI_LIST}
            />
            <FormInput
              form={form}
              name={"jumlah" as Path<T>}
              label="Jumlah Stok"
              type="number"
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              form={form}
              name={"harga_beli" as Path<T>}
              label="Harga Beli (Rp)"
              type="number"
              placeholder="Masukkan harga beli"
            />
            <FormInput
              form={form}
              name={"harga_jual" as Path<T>}
              label="Harga Jual (Rp)"
              type="number"
              placeholder="Masukkan harga jual"
            />
          </div>

          <FormInput
            form={form}
            name={"deskripsi" as Path<T>}
            label="Deskripsi"
            placeholder="Tambahkan catatan detail sparepart..."
          />

          <FormImage
            form={form}
            name={"image_url" as Path<T>}
            label="Foto Barang"
            preview={preview}
            setPreview={setPreview}
          />

          <FormSelect
            form={form}
            name={"is_available" as Path<T>}
            label="Status Ketersediaan"
            selectItem={AVAILABLE_LIST}
          />
            
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
              {type === "Create" ? "Simpan" : "Perbarui"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}