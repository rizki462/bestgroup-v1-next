import z from 'zod';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

export const stockFormSchema = z.object({
  nama: z.string().min(1, 'Nama is required'),
  deskripsi: z.string().min(1, 'Deskripsi is required'),
  harga_beli: z.string().min(1, 'Harga Beli is required'),
  harga_jual: z.string().min(1, 'Harga Jual is required'),
  kategori: z.string().min(1, 'Kategori is required'),
  jumlah: z.string().min(1, 'Jumlah is required'),
  outlet_id: z.string().min(1, 'Outlet is required'),
  image_url: z
      .union([
        z.string(), // Untuk handling URL yang sudah ada (edit mode)
        z.any() // Penampung sementara untuk File
          .refine((file) => file instanceof File, "Data harus berupa file.")
          .refine((file) => file.size <= MAX_FILE_SIZE, "Ukuran maksimal 2MB.")
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Format file tidak didukung."
          ),
      ])
      .optional()
      .or(z.literal("")),
  is_available: z.string().min(1, 'Ketersediaan is required'),
});

export const stockSchema = z.object({
  nama: z.string(),
  deskripsi: z.string(),
  harga_beli: z.number(),
  harga_jual: z.number(),
  kategori: z.string(),
  jumlah: z.number(),
  outlet_id: z.string(),
  image_url: z
      .union([
        z.string(), // Untuk handling URL yang sudah ada (edit mode)
        z.any() // Penampung sementara untuk File
          .refine((file) => file instanceof File, "Data harus berupa file.")
          .refine((file) => file.size <= MAX_FILE_SIZE, "Ukuran maksimal 2MB.")
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Format file tidak didukung."
          ),
      ])
      .optional()
      .or(z.literal("")),
  is_available: z.boolean(),
});

export type StockForm = z.infer<typeof stockFormSchema>;
export type Stock = z.infer<typeof stockSchema> & { id: string };