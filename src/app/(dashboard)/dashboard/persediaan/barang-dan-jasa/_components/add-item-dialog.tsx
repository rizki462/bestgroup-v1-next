"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Package } from "lucide-react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Import Schema, Action & Type
import {
  inventoryItemSchema,
  InventoryItemFormValues,
} from "@/validations/persediaan-validation";
import { createInventoryItem } from "../../actions/persediaan-action";

// Definisikan tipe untuk Props Categories
interface AddItemDialogProps {
  categories: { id: string; nama_kategori: string }[];
}

export function AddItemDialog({ categories }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Setup Form (Adaptasi 6 Jenis Barang Accurate)
  const form = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      kode_barang: "",
      nama_barang: "",
      jenis_barang: "persediaan", // Default seperti Accurate
      satuan: "PCS",
      harga_beli: "",
      harga_jual: "",
      deskripsi: "",
      categories_id: "",
    },
  });

  // 2. Handler Simpan
  async function onSubmit(values: InventoryItemFormValues) {
    setIsLoading(true);
    try {
      const result = await createInventoryItem(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Barang/Jasa berhasil disimpan!");
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  }

  // 3. Logic untuk Dynamic Form (Ala Accurate)
  const watchJenisBarang = form.watch("jenis_barang");
  // Jika pilih 'jasa', field Harga Beli tidak relevan (Opsional)
  const isJasa = watchJenisBarang === "jasa";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2 rounded-xl">
          <Plus className="size-4" />
          Tambah Barang
        </Button>
      </DialogTrigger>

      {/* max-w-2xl untuk layout 2 kolom */}
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader className="flex flex-row items-center gap-4">
          <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center border">
            <Package className="size-6 text-slate-400" />
          </div>
          <div>
            <DialogTitle>Data Baru (Barang & Jasa)</DialogTitle>
            <DialogDescription>
              Lengkapi formulir di bawah ini untuk mendaftarkan aset persediaan
              atau layanan baru.
            </DialogDescription>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-6 border-t mt-4"
          >
            {/* GRID LAYOUT: Meniru layout Accurate image_a83b34.png */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Kolom Kiri: Identitas Utama */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nama_barang"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-900">
                        Nama Barang *
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kode_barang"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-900">
                        Kode / SKU *
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Gunakan ID unik atau part number.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categories_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-900">
                        Kategori *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.nama_kategori}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Kolom Kanan: Detail & Harga */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="jenis_barang"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-900">
                        Jenis Barang
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="persediaan">
                            Persediaan (Stockable)
                          </SelectItem>
                          <SelectItem value="jasa">Jasa (Service)</SelectItem>
                          <SelectItem value="non_persediaan">
                            Non-Persediaan
                          </SelectItem>
                          {/* Tambahkan jenis Accurate lainnya jika database sudah siap */}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="satuan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-900">
                        Satuan *
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Pcs, Unit, Box, Jam" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Grid Harga (Harga Beli Hilang jika Jasa) */}
                <div
                  className={`grid gap-4 ${isJasa ? "grid-cols-1" : "grid-cols-2"}`}
                >
                  {!isJasa && (
                    <FormField
                      control={form.control}
                      name="harga_beli"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-900">
                            Harga Beli
                          </FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="harga_jual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-slate-900">
                          Harga Jual
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Field Deskripsi (Textarea Besar) */}
            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-slate-900">
                    Deskripsi / Spesifikasi
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tulis deskripsi barang" className="resize-none"/>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-8">
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
                className="bg-teal-600 hover:bg-teal-700 text-white min-w-30"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Data
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
