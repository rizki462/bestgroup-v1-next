"use client";

import {
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  getServiceStyle,
  SERVICE_STATUS_COLOR,
  STATUS_UI_STYLE,
} from "@/constants/service-constant";
import { cn } from "@/lib/utils";
import { useState } from "react";
import InformationUserTicket from "./information-user-ticket";
import InspectionUserTicket from "./inspection-user-ticket";

interface InformationProps {
  data: any;
  onStartInspeksi: () => void;
  onClose: () => void;
}

export default function DialogDetailService({
  data,
  onClose,
}: InformationProps) {
  const [isInspeksiMode, setIsInspeksiMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Helper styling
  const { uiStyle } = getServiceStyle(data.status);

  if (!data) return null;

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
          />
        )}
      </div>

      <DialogFooter className="p-6 bg-slate-50 border-t flex justify-between items-center sm:justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-[11px] bg-blue-500 font-bold h-9 px-4 rounded-lg text-white hover:bg-blue-600 hover:text-white"
          >
            CETAK NOTA TANDA TERIMA
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={onClose}
            className="text-[11px] font-bold hover:text-white hover:bg-red-700"
          >
            BATAL
          </Button>

          <Button
            form="form-inspeksi"
            type="submit"
            className={cn(
              "bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold h-9 px-6 rounded-lg",
              !isInspeksiMode,
            )}
          >
            {isInspeksiMode ? "SIMPAN HASIL DIAGNOSA" : "SIMPAN PERUBAHAN"}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
