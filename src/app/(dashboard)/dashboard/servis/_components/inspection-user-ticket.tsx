"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { INSPEKSI_LIST } from "@/constants/service-constant";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, UserCog, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createInspectionService, getTeknisiList } from "../actions";
import { toast } from "sonner";

export default function InspectionUserTicket({ data, onBack, onClose, setIsLoadingParent }: any) {
  // Ambil data dari relation 'inspection' jika ada
  const existingInspeksi = data.inspection;
  const isDisabled = !!existingInspeksi;

  const [inspeksiResults, setInspeksiResults] = useState<Record<string, string>>(
    existingInspeksi?.detail_inspeksi || 
    INSPEKSI_LIST.reduce((acc, item) => ({ ...acc, [item]: "Aman" }), {})
  );

  const [teknisiOptions, setTeknisiOptions] = useState<{label: string, value: string}[]>([]);

  // Ambil daftar teknisi saat form dibuka
  useEffect(() => {
    async function fetchTeknisi() {
      const list = await getTeknisiList();
      setTeknisiOptions(list);
    }
    fetchTeknisi();
  }, []);

  const handleToggleInspeksi = (item: string) => {
    if (isDisabled) return;
    setInspeksiResults((prev) => ({
      ...prev,
      [item]: prev[item] === "Aman" ? "Bermasalah" : "Aman",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled) return;

    setIsLoadingParent(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await createInspectionService(data.id, inspeksiResults, formData);
      if (result.status === "success") {
        toast.success("Berhasil", { description: "Inspeksi disimpan!" });
        onClose();
      } else {
        toast.error("Gagal simpan: " + result.message);
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoadingParent(false);
    }
  };

  return (
    <form id="form-inspeksi" onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" type="button" onClick={onBack}>
          <ArrowLeft className="size-4" />
        </Button>
        <h3 className="font-bold text-lg tracking-tight">
          {isDisabled ? "Data Inspeksi Unit" : "Form Inspeksi Awal Unit"}
        </h3>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl space-y-3">
        <Label className="text-xs font-bold uppercase text-amber-700 flex items-center gap-2">
          <UserCog className="size-4" />Teknisi Penanggung Jawab
        </Label>
        <select 
          name="teknisi_id"
          disabled={isDisabled}
          defaultValue={data.teknisi_id || ""}
          className="w-full p-3 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 transition-all"
        >
          <option value="" disabled>Pilih Teknisi yang Mengerjakan</option>
          {teknisiOptions.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <p className="text-[10px] text-amber-600 italic">* Pilih teknisi yang akan bertanggung jawab melakukan perbaikan</p>
      </div>

      {/* Grid Inspeksi */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {INSPEKSI_LIST.map((item) => (
          <div
            key={item}
            onClick={() => handleToggleInspeksi(item)}
            className={cn(
              "flex flex-col gap-2 p-3 rounded-xl border transition-all select-none",
              !isDisabled && "cursor-pointer hover:shadow-md",
              inspeksiResults[item] === "Aman" ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50 border-red-100",
            )}
          >
            <span className="text-[10px] font-bold uppercase text-slate-500">{item}</span>
            <div className="flex items-center justify-between">
              <span className={cn("text-xs font-bold", inspeksiResults[item] === "Aman" ? "text-emerald-700" : "text-red-700")}>
                {inspeksiResults[item]}
              </span>
              {inspeksiResults[item] === "Aman" ? <Check className="size-4 text-emerald-600" /> : <X className="size-4 text-red-600" />}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase">Keterangan Fisik Unit</Label>
          <textarea
            name="keterangan_unit"
            defaultValue={existingInspeksi?.keterangan_unit}
            disabled={isDisabled}
            className="w-full min-h-20 p-4 text-sm bg-slate-50 border rounded-xl disabled:opacity-80"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase">Hasil Diagnosa & Solusi</Label>
          <textarea
            required
            name="diagnosa_awal"
            defaultValue={existingInspeksi?.diagnosa_awal}
            disabled={isDisabled}
            className="w-full min-h-20 p-4 text-sm bg-slate-50 border rounded-xl disabled:opacity-80"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase">Estimasi Harga (Rp)</Label>
            <input 
              name="estimasi_harga" 
              type="number" 
              defaultValue={existingInspeksi?.estimasi_harga}
              disabled={isDisabled}
              className="w-full p-3 border rounded-xl text-sm disabled:bg-slate-100" 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase">Estimasi Waktu</Label>
            <input 
              name="estimasi_waktu" 
              type="text" 
              defaultValue={existingInspeksi?.estimasi_waktu}
              disabled={isDisabled}
              className="w-full p-3 border rounded-xl text-sm disabled:bg-slate-100" 
            />
          </div>
        </div>
      </div>
    </form>
  );
}