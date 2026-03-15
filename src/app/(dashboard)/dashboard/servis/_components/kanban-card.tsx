"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Calendar, Receipt, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DialogDetailService from "./dialog-detail-service";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { SERVICE_STATUS_COLOR, STATUS_UI_STYLE } from "@/constants/service-constant";

export default function KanbanCard({ data, isOverlay }: { data: any; isOverlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: data.id,
    disabled: open
  });

  const statusKey = SERVICE_STATUS_COLOR[data.status as keyof typeof SERVICE_STATUS_COLOR];
  const cardStyle = STATUS_UI_STYLE[statusKey].cardBadge;

  const cardUI = (
    <Card
      {...(!isOverlay ? { ...listeners, ...attributes } : {})}
      className={cn(
        "transition-all border-l-4 border-l-teal-500 group select-none outline-none",
        isOverlay ? "shadow-2xl ring-2 ring-teal-500 rotate-2 scale-105 cursor-grabbing" : "cursor-grab hover:shadow-md",
        !isOverlay && isDragging ? "opacity-0" : "opacity-100", cardStyle
      )}
    >
      <CardContent className="space-y-2">
        <div className="flex justify-between items-start">
          <span className={cn(
            "text-[12px] font-mono text-muted-foreground border px-2 py-0.5",
            cardStyle
          )}>
            {data.id_tiket}
          </span>
          <div className="flex items-center gap-1 text-[12px] font-medium">
            <Calendar className="size-3" /> {new Date(data.created_at).toLocaleDateString('id-ID')}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-sm text-slate-800 tracking-tight dark:text-white">{data.nama_pelanggan}</h4>
          <p className="text-xs text-muted-foreground truncate italic">{data.unit_laptop}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline" size="sm" className="h-7 text-[10px] gap-1 px-2 hover:bg-teal-50"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://wa.me/${data.no_wa}`, '_blank');
            }}
          >
            <MessageCircle className="size-3" /> Chat
          </Button>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          <div className="size-5 rounded-full bg-teal-100 flex items-center justify-center text-[8px] font-bold text-teal-700">
            {data.teknisi?.charAt(0) || <User className="size-3" />}
          </div>
          <span className="text-[12px] text-teal-700 font-medium truncate">
            {data.teknisi || "Belum ada teknisi"}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  if (isOverlay) return cardUI;

  return (
    <div ref={setNodeRef} className="touch-none outline-none mb-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {cardUI}
        </DialogTrigger>
        <DialogDetailService data={data} onClose={() => setOpen(false)} />
      </Dialog>
    </div>
  );
}