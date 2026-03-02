"use client";

import { useEffect } from "react";
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
import { AVAILABLE_LIST, OUTLET_LIST } from '@/constants/auth-constant';
import { KATEGORI_LIST } from '@/constants/stock-constant';
import { Preview } from '@/types/general';
import { Loader2 } from 'lucide-react';
import { FormEvent } from 'react';
import { FieldValues, Path, UseFormReturn, useWatch } from 'react-hook-form';

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
  
  // 1. Pantau perubahan jumlah stok
  const jumlahWatch = useWatch({
    control: form.control,
    name: "jumlah" as Path<T>,
  });

  // 2. Efek untuk sinkronisasi otomatis status ketersediaan
  useEffect(() => {
    // Pastikan nilai jumlah diperlakukan sebagai angka
    const currentJumlah = jumlahWatch !== undefined ? Number(jumlahWatch) : 0;
    
    // Logika: Jika jumlah > 0 maka true (Ready), jika <= 0 maka false (Not Ready)
    // Gunakan nilai string "true"/"false" jika AVAILABLE_LIST menggunakan value string
    if (currentJumlah > 0) {
      form.setValue("is_available" as Path<T>, true as any);
    } else {
      form.setValue("is_available" as Path<T>, false as any);
    }
  }, [jumlahWatch, form]); // Akan jalan setiap jumlah berubah ATAU saat form pertama kali muncul

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

          <div className="grid grid-cols-2 gap-4">
             <FormSelect
              form={form}
              name={"is_available" as Path<T>}
              label="Status Ketersediaan"
              selectItem={AVAILABLE_LIST}
            />

            <FormSelect
              form={form}
              name={"outlet_id" as Path<T>}
              label="Outlet"
              selectItem={OUTLET_LIST}
            />
          </div>
            
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
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