import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useActionState, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createStock } from '../actions';
import { toast } from 'sonner';
import { Preview } from '@/types/general';
import { StockForm, stockFormSchema } from '@/validations/stock-validation';
import { INITIAL_STOCK, INITIAL_STATE_STOCK } from '@/constants/stock-constant';
import FormStock from './form-stock';

export default function DialogCreateStock({ refetch }: { refetch: () => void }) {
  const form = useForm<StockForm>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: INITIAL_STOCK,
  });

  const [createStockState, createStockAction, isPendingCreateStock] =
    useActionState(createStock, INITIAL_STATE_STOCK);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, key === 'image_url' ? preview!.file ?? '' : value);
    });

    startTransition(() => {
      createStockAction(formData);
    });
  });

  useEffect(() => {
    if (createStockState?.status === 'error') {
      toast.error('Create Stock Failed', {
        description: createStockState.errors?._form?.[0],
      });
    }

    if (createStockState?.status === 'success') {
      toast.success('Create Stock Success');
      form.reset();
      setPreview(undefined);
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch();
    }
  }, [createStockState]);

  return (
    <FormStock
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingCreateStock}
      type="Create"
      preview={preview}
      setPreview={setPreview}
    />
  );
}