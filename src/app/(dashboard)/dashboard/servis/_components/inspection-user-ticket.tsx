"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { INSPEKSI_LIST } from "@/constants/service-constant";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, X } from "lucide-react";
import { useState } from "react";
import { updateInspeksiService } from "../actions";
import { toast } from "sonner";

interface InspectionProps {
  data: any;
  onBack: () => void;
  onClose: () => void;
  setIsLoadingParent: (val: boolean) => void;
}

export default function InspectionUserTicket({ data, onBack, onClose, setIsLoadingParent }: InspectionProps) {
  const [inspeksiResults, setInspeksiResults] = useState<Record<string, string>>(
    INSPEKSI_LIST.reduce((acc, item) => ({ ...acc, [item]: "Aman" }), {})
  );

  const handleToggleInspeksi = (item: string) => {
    setInspeksiResults((prev) => ({
      ...prev,
      [item]: prev[item] === "Aman" ? "Bermasalah" : "Aman",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingParent(true);
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      inspeksi: inspeksiResults,
      keterangan_unit: formData.get("keterangan_unit"),
      diagnosa_awal: formData.get("diagnosa_awal"),
      estimasi_harga: formData.get("estimasi_harga"),
      estimasi_waktu: formData.get("estimasi_waktu"),
    };

    try {
      const result = await updateInspeksiService(data.id, payload);
      if (result.status === "success") {
        toast.success("Inspeksi Berhasil Disimpan", {
          description: "Status tiket otomatis pindah ke Nunggu Konfirmasi",
        });
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
        <h3 className="font-bold text-lg tracking-tight">Form Inspeksi Awal Unit</h3>
      </div>

      {/* Grid Inspeksi */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {INSPEKSI_LIST.map((item) => (
          <div
            key={item}
            onClick={() => handleToggleInspeksi(item)}
            className={cn(
              "flex flex-col gap-2 p-3 rounded-xl border transition-all cursor-pointer select-none",
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

      {/* Inputs */}
      <div className="space-y-4 pt-4 border-t">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase">Keterangan Fisik Unit</Label>
          <textarea
            name="keterangan_unit"
            placeholder="Misal: Baut tidak ada 2, Casing lecet pemakaian"
            className="w-full min-h-20 p-4 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase">Hasil Diagnosa Awal & Solusi</Label>
          <textarea
            required
            name="diagnosa_awal"
            placeholder="Contoh: SSD Bad Sector. Rekomendasi ganti SSD 256GB."
            className="w-full min-h-20 p-4 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase">Estimasi Harga (Rp)</Label>
            <input name="estimasi_harga" type="number" placeholder="650000" className="w-full p-3 border rounded-xl text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase">Estimasi Waktu</Label>
            <input name="estimasi_waktu" type="text" placeholder="1-2 Hari" className="w-full p-3 border rounded-xl text-sm" />
          </div>
        </div>
      </div>
    </form>
  );
}