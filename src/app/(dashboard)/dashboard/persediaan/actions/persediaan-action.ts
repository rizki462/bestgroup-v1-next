"use server";

import { createClient } from "@/lib/supabase/server";
import {
  InventoryItemFormValues,
  inventoryItemSchema,
  KategoriFormValues,
  kategoriSchema,
} from "@/validations/persediaan-validation";
import { revalidatePath } from "next/cache";

// --- ACTION UNTUK KATEGORI ---
export async function createKategori(data: KategoriFormValues) {
  const supabase = await createClient();

  const validateFields = kategoriSchema.safeParse(data);
  if (!validateFields.success) {
    return { error: "Data kategori tidak valid!" };
  }

  const { error } = await supabase
    .from("categories")
    .insert(validateFields.data);

  if (error) {
    if (error.code === "23505") return { error: "Nama kategori sudah ada!" };
    return { error: error.message };
  }

  revalidatePath("/persediaan/barang-dan-jasa");
  return { success: true };
}

// --- ACTION UNTUK INVENTORY ITEM (BARANG & JASA) ---
export async function createInventoryItem(data: InventoryItemFormValues) {
  const supabase = await createClient();

  const validateFields = inventoryItemSchema.safeParse(data);
  if (!validateFields.success) {
    return { error: "Data barang tidak valid!" };
  }

  // Sesuai ERD Bapak, kita masukkan ke tabel inventory_items
  const { error } = await supabase.from("inventory_items").insert({
    kode_barang: validateFields.data.kode_barang,
    nama_barang: validateFields.data.nama_barang,
    categories_id: validateFields.data.categories_id,
    jenis_barang: validateFields.data.jenis_barang,
    harga_beli: validateFields.data.harga_beli,
    harga_jual: validateFields.data.harga_jual,
    satuan: validateFields.data.satuan,
    deskripsi: validateFields.data.deskripsi,
  });

  if (error) {
    if (error.code === "23505")
      return { error: "Kode Barang (SKU) sudah digunakan!" };
    return { error: error.message };
  }

  revalidatePath("/persediaan/barang-dan-jasa");
  return { success: true };
}

// Ambil Semua Kategori (Untuk Dropdown)
export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("nama_kategori", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

// Ambil Master Barang & Jasa (Join dengan Kategori)
export async function getInventoryItems() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inventory_items")
    .select(
      `
      *,
      categories (
        nama_kategori
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Ambil Saldo Stok per Barang (Untuk halaman Barang per Gudang)
export async function getStockBalances() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("stock_balances").select(`
      *,
      inventory_items (*),
      warehouses (*)
    `);

  if (error) throw new Error(error.message);
  return data;
}
