import { z } from "zod";

export const createTicketServiceSchema = z.object({
  nama_pelanggan: z.string().min(3, "Nama pelanggan minimal 3 karakter"),
  no_wa: z.string().min(10, "Nomor WhatsApp minimal 10 angka"),
  unit_laptop: z.string().min(3, "Sebutkan unit laptop (contoh: ASUS ROG GL553)"),
  keluhan: z.string().min(5, "Jelaskan keluhan minimal 5 karakter"),
});

export type CreateTicketForm = z.infer<typeof createTicketServiceSchema>;