"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, ClipboardCheck, Clock, Monitor, Receipt } from "lucide-react";
import { INSPEKSI_LIST } from "@/constants/service-constant";
import { cn } from "@/lib/utils";

interface InformationProps {
  data: any;
  onStartInspeksi: () => void;
  onClose: () => void;
}

export default function InformationUserTicket({
  data,
  onStartInspeksi,
}: InformationProps) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        {/* INFO UNIT & PELANGGAN */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
              Pelanggan
            </p>
            <p className="text-sm font-bold text-slate-800">
              {data.nama_pelanggan}
            </p>
            <p className="text-[14px] text-slate-700">{data.no_wa}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
              Unit Laptop
            </p>
            <div className="flex items-center gap-2">
              <Monitor className="size-3 text-teal-600" />
              <p className="text-sm font-bold text-slate-800">
                {data.unit_laptop}
              </p>
            </div>
          </div>
        </div>

        {/* KELUHAN USER */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-red-600 font-bold text-[11px] uppercase">
            <AlertCircle className="size-4" /> Keluhan User
          </Label>
          <div className="p-4 bg-red-50/30 rounded-xl border border-red-100 text-sm italic text-slate-700 leading-relaxed">
            "{data.keluhan}"
          </div>
        </div>

        {/* HASIL DIAGNOSA (Muncul jika sudah diinspeksi) */}
        {data.inspection && (
          <div className="space-y-4 pt-4 border-t border-dashed">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-teal-600 font-bold text-[11px] uppercase">
                <Receipt className="size-4" /> Hasil Diagnosa & Solusi SA
              </Label>
              <div className="p-4 bg-teal-50/30 rounded-xl border border-teal-100">
                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                  {data.inspection.diagnosa_awal}
                </p>
                {data.inspection.keterangan_unit && (
                  <p className="text-[11px] text-slate-500 mt-2 italic">
                    Ket. Fisik: {data.inspection.keterangan_unit}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Estimasi Biaya</p>
                <p className="text-sm font-bold text-teal-700">
                  Rp {data.inspection.estimasi_harga?.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Estimasi Waktu</p>
                <p className="text-sm font-bold text-teal-700">{data.inspection.estimasi_waktu}</p>
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW CHECKLIST INSPEKSI */}
        <div className="space-y-2">
          <Label className="text-[11px] font-bold uppercase text-slate-500">
            Preview Checklist Fisik
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {INSPEKSI_LIST.slice(0, 4).map((item) => {
              const status = data.inspection?.detail_inspeksi?.[item] || "Aman";
              return (
                <div
                  key={item}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded border text-[10px]"
                >
                  <span className="font-medium">{item}</span>
                  <span
                    className={cn(
                      "font-bold",
                      status === "Aman" ? "text-emerald-600" : "text-red-600",
                    )}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
            <div className="col-span-full text-center">
              <Button
                variant="ghost"
                className="text-[12px] h-6 text-teal-600"
                onClick={onStartInspeksi}
              >
                {data.inspection
                  ? "Lihat Detail Inspeksi Lengkap"
                  : "Mulai Inspeksi Sekarang"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SIDEBAR INFO PJ */}
      <div className="space-y-6 md:border-l md:pl-6">
        <div className="space-y-3">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
            Teknisi PJ
          </p>
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border">
            <div className="size-8 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {data.teknisi?.charAt(0) || "?"}
            </div>
            <span className="text-sm font-bold text-slate-700">
              {data.teknisi || "Belum Ada"}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
            Waktu Masuk
          </p>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <Clock className="size-3 text-slate-400" />
            {new Date(data.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        <Button
          type="button"
          disabled={!!data.inspection} // Matikan tombol jika sudah diinspeksi
          onClick={onStartInspeksi}
          className={cn(
            "w-full text-[11px] font-bold h-10 rounded-xl gap-2",
            data.inspection 
              ? "bg-slate-100 text-slate-400 border cursor-not-allowed" 
              : "bg-slate-900 hover:bg-slate-800 text-white"
          )}
        >
          <ClipboardCheck className="size-4" /> 
          {data.inspection ? "UNIT SUDAH DIINSPEKSI" : "MULAI INSPEKSI (SA)"}
        </Button>
      </div>
    </div>
  );
}