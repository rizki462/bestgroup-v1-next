"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Import Schema & Action (Yang tadi sudah kita buat)
import { 
  kategoriSchema, 
  KategoriFormValues 
} from "@/validations/persediaan-validation";
import { createKategori } from "../../actions/persediaan-action";
import FormInput from "@/components/common/form-input";

export function AddKategoriDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Setup Form pakai React Hook Form + Zod
  const form = useForm<KategoriFormValues>({
    resolver: zodResolver(kategoriSchema),
    defaultValues: {
      nama_kategori: "",
      deskripsi: ""
    },
  });

  // 2. Handler Simpan (Konek ke Server Action)
  async function onSubmit(values: KategoriFormValues) {
    setIsLoading(true);
    try {
      const result = await createKategori(values);
      if (result.error) {
        // Tampilkan error (Misal: Nama kategori kembar)
        toast.error(result.error);
      } else {
        toast.success("Kategori berhasil ditambahkan!");
        form.reset();
        setOpen(false); // Tutup Dialog
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Tombol pemicu dengan gaya Best Group (Teal) */}
        <Button variant="outline" className="gap-2 border-teal-200 text-teal-700 hover:bg-teal-50 rounded-xl">
          <Plus className="size-4" />
          Kategori Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Tambah Kategori</DialogTitle>
          <DialogDescription>
            Buat kelompok baru untuk mengorganisir barang dan jasa Anda.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Field Nama Kategori */}
            <FormField
              control={form.control}
              name="nama_kategori"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kategori</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Sparepart, Jasa, Aksesoris" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Field Deskripsi (Textarea) */}
            <FormInput
              form={form}
              name="deskripsi"
              label="Deskripsi"
              placeholder="Masukkan deskripsi kategori"
              type="textarea"
            />

            {/* Footer Tombol */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                className="bg-teal-600 hover:bg-teal-700 text-white"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Kategori
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}