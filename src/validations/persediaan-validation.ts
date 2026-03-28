import * as z from "zod";

// --- SCHEMA KATEGORI ---
export const kategoriSchema = z.object({
  nama_kategori: z.string().min(1, "Nama kategori wajib diisi"),
  deskripsi: z.string().optional().nullable(),
});

// --- SCHEMA INVENTORY ITEM (BARANG & JASA) ---
export const inventoryItemSchema = z.object({
  kode_barang: z.string().min(1, "Kode/SKU wajib diisi"),
  nama_barang: z.string().min(1, "Nama barang/jasa wajib diisi"),
  categories_id: z.string().uuid("Pilih kategori yang valid"), // Relasi ke tabel categories
  jenis_barang: z.enum([
    "persediaan",
    "non_persediaan",
    "jasa",
    "grup",
    "modifier",
    "varian",
  ]),
  satuan: z.string().min(1, "Satuan wajib diisi (Pcs, Unit, dll)"),
  harga_beli: z.string().min(0, "Harga beli tidak boleh negatif"),
  harga_jual: z.string().min(0, "Harga jual tidak boleh negatif"),
  deskripsi: z.string().optional().nullable(),
  
});

// --- TYPES ---
export type KategoriFormValues = z.infer<typeof kategoriSchema>;
export type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>;