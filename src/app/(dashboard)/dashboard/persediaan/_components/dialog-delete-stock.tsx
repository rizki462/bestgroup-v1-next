import DialogDelete from '@/components/common/dialog-delete-stock';
import { Profile } from '@/types/auth';
import { startTransition, useActionState, useEffect } from 'react';
import { deleteStock } from '../actions';
import { INITIAL_STATE_ACTION } from '@/constants/general-contants';
import { toast } from 'sonner';
import { Stock } from '@/validations/stock-validation';

export default function DialogDeleteStock({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: Stock;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [deleteStockState, deleteStockAction, isPendingDeleteStock] =
    useActionState(deleteStock, INITIAL_STATE_ACTION);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append('id', currentData!.id as string);
    formData.append('image_url', currentData!.image_url as string);
    startTransition(() => {
      deleteStockAction(formData);
    });
  };

  useEffect(() => {
    if (deleteStockState?.status === 'error') {
      toast.error('Delete Stock Failed', {
        description: deleteStockState.errors?._form?.[0],
      });
    }

    if (deleteStockState?.status === 'success') {
      toast.success('Delete Stock Success');
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteStockState]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteStock}
      onSubmit={onSubmit}
      title="Stock"
    />
  );
}