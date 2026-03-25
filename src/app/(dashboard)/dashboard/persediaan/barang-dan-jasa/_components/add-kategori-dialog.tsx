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
import { 
    KategoriFormSchema,
  kategoriSchema, 
  
} from "@/validations/persediaan-validation";
import { createKategori } from "../../actions";


export function AddKategoriDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<KategoriFormSchema>({
    resolver: zodResolver(kategoriSchema),
    defaultValues: {
      nama_kategori: "",
      deskripsi: "",
      parent_id: null,
    },
  });

  async function onSubmit(values: KategoriFormSchema) {
    setIsLoading(true);
    try {
      const result = await createKategori(values);
      if (result.status === "error") {
        toast.error(result.message);
      } else {
        toast.success("Kategori berhasil ditambahkan!");
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-teal-200 text-teal-700 hover:bg-teal-50">
          <Plus className="size-4" />
          Kategori Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-blue-500">Tambah Kategori</DialogTitle>
          <DialogDescription>
            Informasi kategori yang akan ditambahkan
          </DialogDescription>
        </DialogHeader>
        <div className="h-px bg-gray-400 dark:bg-gray-700" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            
            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Penjelasan singkat tentang kategori ini..." 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
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