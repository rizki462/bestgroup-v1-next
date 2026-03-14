"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createTicketServiceSchema } from "@/validations/service-validation";
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
    status: formData.get("status") || "antrian",
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

  // Ambil count untuk penomoran
  const { count } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true });

  const ticketId = `SRV-${dateString}-${((count || 0) + 1).toString().padStart(3, "0")}`;

  // Insert ke Database
  const { error } = await supabase.from("services").insert({
    id_tiket: ticketId,
    ...validatedFields.data,
    created_at: new Date().toISOString(),
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
