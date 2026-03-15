import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Clock, User, Monitor, AlertCircle } from "lucide-react";
import { SERVICE_STATUS_COLOR, STATUS_UI_STYLE } from "@/constants/service-constant";
import { cn } from "@/lib/utils";

export default function DialogDetailService({ data, onClose }: { data: any, onClose: () => void }) {
  if (!data) return null;

  const statusKey = SERVICE_STATUS_COLOR[data.status as keyof typeof SERVICE_STATUS_COLOR];
  const statusUnit = STATUS_UI_STYLE[statusKey].textStatus;

  return (
    <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
      <DialogHeader className="flex flex-row items-center mr-5 justify-between space-y-0 pb-2">
        <DialogTitle className="text-xl font-bold font-mono">{data.id_tiket}</DialogTitle>
        <Badge variant="default" className={cn(
          "text-[14px] font-bold text-white px-2", statusUnit
        )}>
          {data.status}
        </Badge>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
        {/* Kolom Kiri: Info Unit & Pelanggan */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Pelanggan</p>
              <p className="text-sm font-semibold dark:text-slate-800">{data.nama_pelanggan}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">No. WA</p>
              <p className="text-sm  dark:text-slate-800">{data.no_wa}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Unit</p>
              <div className="flex items-center gap-2">
                <Monitor className="size-4 text-slate-400" />
                <p className="text-sm font-medium dark:text-slate-800">{data.unit_laptop}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-red-600">
              <AlertCircle className="size-4" /> Keluhan
            </Label>
            <div className="p-3 bg-red-50/50 rounded-md border border-red-100 text-sm italic text-slate-700">
              "{data.keluhan}"
            </div>
          </div>

          <div className="space-y-2">
            <Label>Catatan Teknisi / Progres</Label>
            <div className="p-3 bg-teal-50/30 rounded-md border border-teal-100 text-sm text-gray-500 min-h-20">
              {data.catatan_teknisi || "Belum ada catatan pengerjaan..."}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Status & History */}
        <div className="space-y-4 border-l pl-4 hidden md:block">
          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground uppercase">Teknisi</Label>
            <div className="flex items-center gap-2">
               <div className="size-6 rounded-full bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700">
                {data.teknisi?.charAt(0)}
              </div>
              <span className="text-sm">{data.teknisi}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground uppercase">Waktu Masuk</Label>
            <div className="flex items-center gap-2 text-xs">
              <Clock className="size-3 text-slate-400" />
              {new Date(data.created_at).toLocaleDateString('id-ID')}
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="flex justify-between sm:justify-between items-center border-t pt-4">
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="text-xs">Cetak Tiket</Button>
           <Button variant="outline" size="sm" className="text-xs text-blue-600">Selesaikan</Button>
        </div>
        <Button onClick={onClose} className="bg-teal-600 hover:bg-teal-700 text-white text-xs">Simpan Perubahan</Button>
      </DialogFooter>
    </DialogContent>
  );
}