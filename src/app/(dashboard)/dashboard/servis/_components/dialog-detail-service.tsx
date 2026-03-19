"use client";

import {
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getServiceStyle } from "@/constants/service-constant";
import { cn } from "@/lib/utils";
import { useState } from "react";
import InformationUserTicket from "./information-user-ticket";
import InspectionUserTicket from "./form-inspection-user-ticket";
import { FileText, Printer } from "lucide-react";

interface DialogDetailProps {
  data: any;
  onClose: () => void;
  onStartInspeksi?: () => void;
}

export default function DialogDetailService({
  data,
  onClose,
  onStartInspeksi,
}: DialogDetailProps) {
  const [isInspeksiMode, setIsInspeksiMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Helper styling
  const { uiStyle } = getServiceStyle(data.status);

  // Jika sudah ada data inspeksi dari database
  const isAlreadyInspected = !!data.inspection;

  if (!data) return null;

  const statusUnit = data.status;
  const showNotaTandaTerima = [
    "antrian",
    "konfirmasi",
    "part",
    "pengerjaan",
  ].includes(statusUnit);
  const showInvoice = statusUnit === "selesai";
  const hideButton = ["diambil", "batal"].includes(statusUnit);

  return (
    <DialogContent className="sm:max-w-175 max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl">
      {/* HEADER */}
      <div
        className={cn(
          "p-6 text-white transition-colors duration-500",
          uiStyle.header,
        )}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">
              Detail Tiket
            </p>
            <DialogTitle className="text-2xl font-bold font-mono tracking-tighter">
              {data.id_tiket}
            </DialogTitle>
          </div>
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-md uppercase text-[10px]">
            {data.status}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        {!isInspeksiMode ? (
          <InformationUserTicket
            data={data}
            onStartInspeksi={() => setIsInspeksiMode(true)}
            onClose={onClose}
          />
        ) : (
          <InspectionUserTicket
            data={data}
            onBack={() => setIsInspeksiMode(false)}
            onClose={onClose}
            setIsLoadingParent={setIsLoading}
            isDisabled={isAlreadyInspected}
          />
        )}
      </div>

      <DialogFooter className="p-6 bg-slate-50 border-t flex justify-between items-center sm:justify-between">
        <div className="flex gap-2">
          {/* Tombol untuk cetak tanda terima ketika status antrian, konfirmasi, part, pengerjaan */}
          {!hideButton && (
            <>
              {showNotaTandaTerima && (
                <Button
                  type="button"
                  // onClick={onPrintNota}
                  className="w-full text-[11px] uppercase font-bold h-10 rounded-xl gap-2 bg-blue-600 hover:bg-blue-800 text-white"
                >
                  Cetak Nota Tanda Terima
                </Button>
              )}

              {showInvoice && (
                <Button
                  type="button"
                  // onClick={onPrintInvoice}
                  className="w-full text-[11px] uppercase font-bold h-10 rounded-xl gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Cetak Invoice
                </Button>
              )}
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={onClose}
            className="text-[11px] font-bold"
          >
            BATAL
          </Button>

          {/* Sembunyikan tombol Simpan jika sudah pernah diinspeksi atau tidak dalam mode inspeksi */}
          {(!isAlreadyInspected || isInspeksiMode) && (
            <Button
              form="form-inspeksi"
              type="submit"
              disabled={isAlreadyInspected || isLoading}
              className={cn(
                "bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold h-9 px-6 rounded-lg",
                !isInspeksiMode && "hidden",
              )}
            >
              {isAlreadyInspected
                ? "SUDAH DIINSPEKSI"
                : "SIMPAN HASIL DIAGNOSA"}
            </Button>
          )}
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
