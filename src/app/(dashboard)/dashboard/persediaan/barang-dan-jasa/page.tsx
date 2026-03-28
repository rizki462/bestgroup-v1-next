"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Search, Filter, PackageSearch, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertIDR } from "@/lib/utils";
import { AddItemDialog } from "./_components/add-item-dialog";
import { AddKategoriDialog } from "./_components/add-kategori-dialog";

export default function BarangJasaPage() {
  const supabase = createClient();

  // State Filter & Search Bar
  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState("all");
  const [filterKategori, setFilterKategori] = useState("all");

  // Fetch Categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("nama_kategori");
      return data || [];
    },
  });

  // Fetch Inventory Items
  const {
    data: items,
    isLoading,
    refetch,
  } = useQuery({
    // Filter dimasukkan ke queryKey agar otomatis refetch saat state berubah
    queryKey: ["inventory_items", search, filterJenis, filterKategori],
    queryFn: async () => {
      let query = supabase
        .from("inventory_items")
        .select("*, categories(nama_kategori)")
        .order("created_at", { ascending: false });

      // Logic Filter Jenis
      if (filterJenis !== "all") {
        query = query.eq("jenis_barang", filterJenis);
      }

      // Logic Filter Kategori (Berdasarkan UUID)
      if (filterKategori !== "all") {
        query = query.eq("categories_id", filterKategori);
      }

      // Logic Search
      if (search) {
        query.or(`nama_barang.ilike.%${search}%,kode_barang.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        toast.error("Gagal mengambil data barang");
        throw error;
      }
      return data || [];
    },
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Barang dan Jasa
          </h1>
          <p className="text-sm text-slate-500">
            Master data aset dan layanan Best Group.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AddKategoriDialog />
          {/* Kirim refetch agar setelah tambah data, tabel otomatis update */}
          <AddItemDialog categories={categories || []} />
        </div>
      </div>

      {/* Toolbar Ala Accurate (Full Functional) */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 min-w-70 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Cari kode atau nama barang..."
            className="pl-10 bg-slate-50 border-none shadow-none focus-visible:ring-1 ring-slate-200"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="size-4 text-slate-400" />
          
          {/* Filter Jenis Barang */}
          <Select onValueChange={setFilterJenis} defaultValue="all">
            <SelectTrigger className="w-40 bg-slate-50 border-none shadow-none">
              <SelectValue placeholder="Semua Jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              <SelectItem value="persediaan">Persediaan</SelectItem>
              <SelectItem value="jasa">Jasa</SelectItem>
              <SelectItem value="non_persediaan">Non-Persediaan</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Kategori */}
          <Select onValueChange={setFilterKategori} defaultValue="all">
            <SelectTrigger className="w-40 bg-slate-50 border-none shadow-none">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.nama_kategori}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm min-h-100">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
             <p className="text-slate-400 animate-pulse">Memuat data barang...</p>
          </div>
        ) : items?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <PackageSearch className="size-10 text-slate-200" />
            </div>
            <h3 className="font-semibold text-slate-700 text-lg">
              Data tidak ditemukan
            </h3>
            <p className="text-sm text-slate-400 max-w-xs">
              Coba ubah kata kunci pencarian atau filter Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                <tr>
                  <th className="px-6 py-4">Nama Barang</th>
                  <th className="px-6 py-4">Kode / SKU</th>
                  <th className="px-6 py-4">Jenis</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4 text-right">Harga Jual</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items?.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {item.nama_barang}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs uppercase">
                      {item.kode_barang}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase text-slate-600 border border-slate-200">
                        {item.jenis_barang}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.categories?.nama_kategori || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-teal-600 font-bold">
                        {convertIDR(item.harga_jual)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}