"use client";

import FormInput from '@/components/common/form-input';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Loader2, ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

export default function FormInspectionTicket<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  onBack,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={onBack} type="button">
              <ArrowLeft className="size-4" />
           </Button>
           <DialogTitle>Diagnosa & Estimasi Unit</DialogTitle>
        </div>
        <DialogDescription>
          Lengkapi hasil diagnosa SA untuk pencetakan nota terima service.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <FormInput
            form={form}
            name={"keterangan_unit" as any}
            label="Keterangan Fisik Unit"
            placeholder="Contoh: Baut kurang 2, Casing lecet pojok kiri"
          />

          <FormInput
            form={form}
            name={"diagnosa_awal" as any}
            label="Hasil Diagnosa & Solusi"
            placeholder="Contoh: SSD Bad Sector, ganti SSD 256GB"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              form={form}
              name={"estimasi_harga" as any}
              label="Estimasi Harga (Rp)"
              type="number"
              placeholder="0"
            />
            <FormInput
              form={form}
              name={"estimasi_waktu" as any}
              label="Estimasi Pengerjaan"
              placeholder="1-2 Hari"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={onBack}>Batal</Button>
            <Button type="submit" disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
              Simpan Hasil
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}