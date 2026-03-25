import { z } from 'zod';

// Skema untuk kategori
export const kategoriSchema = z.object({
    nama_kategori: z.string().min(1, 'Nama tidak boleh kosong'),
    deskripsi: z.string().min(1, 'Deskripsi tidak boleh kosong'),
    parent_id: z.string().uuid().optional().nullable(),
});

// Skema untuk Master Barang (Invetory Items)
export const inventoryItemSchema = z.object({
    kode_barang: z.string().min(1, 'Kode Barang perlu diisi'),
    nama: z.string().min(1, 'Nama tidak boleh kosong'),
    deskripsi: z.string().min(1, 'Deskripsi tidak boleh kosong'),
    harga_beli: z.number().min(1, 'Masukan harga beli'),
    harga_jual: z.number().min(1, 'Masukan harga jual'),
    kategori_id: z.string().uuid().min(1, 'Pilih Kategori yang sesuai'),
    jenis_barang: z.enum([
        "persediaan",
        "non_persediaan",
        "jasa",
        "grup",
        "varian"
    ]),
});

export type KategoriFormSchema = z.infer<typeof kategoriSchema>;
export type InventoryItemFormSchema = z.infer<typeof inventoryItemSchema>;