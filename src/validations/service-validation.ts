import { z } from "zod";

export const createTicketServiceSchema = z.object({
  nama_pelanggan: z.string().min(3, "Nama pelanggan minimal 3 karakter"),
  no_wa: z.string().min(10, "Nomor WhatsApp minimal 10 angka"),
  unit_laptop: z.string().min(3, "Sebutkan unit laptop (contoh: ASUS ROG GL553)"),
  keluhan: z.string().min(5, "Jelaskan keluhan minimal 5 karakter"),
});

export const inspeksiServiceSchema = z.object({
  inspeksi: z.record(z.string(), z.string()),
  teknisi_id: z.string().min(1, "Teknisi wajib diisi"),
  keterangan_unit: z.string().min(2, "Keterangan unit wajib diisi"),
  pin_password: z.string().optional(),
  diagnosa_awal: z.string().min(5, "Diagnosa wajib diisi"),
  estimasi_harga: z.string().min(1, "Estimasi harga wajib diisi"),
  estimasi_waktu: z.string().min(1, "Estimasi waktu wajib diisi"),
});

export type InspeksiForm = z.infer<typeof inspeksiServiceSchema>;
export type CreateTicketForm = z.infer<typeof createTicketServiceSchema>;