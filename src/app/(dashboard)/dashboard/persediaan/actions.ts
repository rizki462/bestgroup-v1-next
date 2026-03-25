"use server";

import { createClient } from "@/lib/supabase/server";
import { KategoriFormSchema, kategoriSchema } from "@/validations/persediaan-validation";
import { revalidatePath } from "next/cache";

export async function createKategori(data: KategoriFormSchema) {
    const supabase = await createClient();

    const validatedFields = kategoriSchema.safeParse(data);
    if (!validatedFields.success) {
        return {
            status: "error",
            errors: {
                ...validatedFields.error.flatten().fieldErrors,
                _form: [],
            },
        };
    }

    const { error } = await supabase.from("categories").insert(validatedFields.data);

    if (error) {
        return { status: "error", message: error.message };
    }

    revalidatePath("/dashboard/persediaan/barang-dan-jasa");
    return { status: "success", message: "Kategori berhasil ditambahkan" };
};