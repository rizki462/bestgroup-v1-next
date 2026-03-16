"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createTicketServiceSchema, inspeksiServiceSchema } from "@/validations/service-validation";
import { TicketFormState } from "@/types/service";

export async function createService(
  prevState: TicketFormState,
  formData: FormData,
) {
  let validatedFields = createTicketServiceSchema.safeParse({
    nama_pelanggan: formData.get("nama_pelanggan"),
    no_wa: formData.get("no_wa"),
    unit_laptop: formData.get("unit_laptop"),
    keluhan: formData.get("keluhan"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();

  // Generate ID Tiket Otomatis (SRV-YYYYMM-XXX)
  const date = new Date();
  const dateString = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}`;

  // Ambil data terakhir untuk penomoran
  const { data: lastTicket } = await supabase
    .from('services')
    .select('id_tiket')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  let nextNumber = 1;
  if (lastTicket){
    const lastTicketNumber = parseInt(lastTicket.id_tiket.split('-')[2]);
    nextNumber = lastTicketNumber + 1;
  }

  // Generate ID Tiket
  const ticketId = `SRV-${dateString}-${nextNumber.toString().padStart(3, "0")}`;

  // Insert ke Database
  const { error } = await supabase
    .from("services")
    .insert({
      id_tiket: ticketId,
      ...validatedFields.data,
      created_at: new Date().toISOString(),
      status: 'antrian'
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/service");
  return { status: "success", message: "Tiket berhasil dibuat!" };
}

export async function updateServiceStatus(
  serviceId: string,
  newStatus: string,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("services")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", serviceId);

  if (error) return { status: "error", message: error.message };

  revalidatePath("/dashboard/service");
  return { status: "success", message: "Status berhasil diubah!" };
}

export async function createInspectionService(
  serviceId: string,
  inspeksiData: any,
  formData: FormData
) {
  const supabase = await createClient();

  const validatedFields = inspeksiServiceSchema.safeParse({
    inspeksi: inspeksiData,
    diagnosa_awal: formData.get("diagnosa_awal"),
    estimasi_harga: formData.get("estimasi_harga"),
    estimasi_waktu: formData.get("estimasi_waktu"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Insert ke tabel inspection_services
  const { error: insError } = await supabase
    .from("inspection_services")
    .insert({
      service_id: serviceId,
      detail_inspeksi: validatedFields.data.inspeksi,
      keterangan_unit: formData.get("keterangan_unit"),
      diagnosa_awal: validatedFields.data.diagnosa_awal,
      estimasi_harga: parseInt(validatedFields.data.estimasi_harga),
      estimasi_waktu: validatedFields.data.estimasi_waktu,
    });

  if (insError) return { status: "error", message: insError.message };

  // Update Status di tabel utama (services)
  const { error: servError } = await supabase
    .from("services")
    .update({ status: "antrian" })
    .eq("id", serviceId);

  if (servError) return { status: "error", message: servError.message };

  revalidatePath("/dashboard/service");
  return { status: "success", message: "Inspeksi berhasil disimpan!" };
}
