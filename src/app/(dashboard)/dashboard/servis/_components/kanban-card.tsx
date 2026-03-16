"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Calendar, Receipt, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DialogDetailService from "./dialog-detail-service";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import {
  getServiceStyle,
  SERVICE_STATUS_COLOR,
  STATUS_UI_STYLE,
} from "@/constants/service-constant";

export default function KanbanCard({
  data,
  isOverlay,
}: {
  data: any;
  isOverlay?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: data.id,
    disabled: open,
  });

  const { uiStyle } = getServiceStyle(data.status);
  const cardStyle = uiStyle.cardBadge;

  const today = new Date();
  const createdDate = new Date(data.created_at);
  const isToday =
    today.getDate() === createdDate.getDate() &&
    today.getMonth() === createdDate.getMonth() &&
    today.getFullYear() === createdDate.getFullYear();

  const cardUI = (
    <Card
      {...(!isOverlay ? { ...listeners, ...attributes } : {})}
      className={cn(
        "transition-all border-l-4 group select-none outline-none",
        isOverlay
          ? "shadow-2xl duration-200 scale-105 cursor-grabbing"
          : "cursor-grab hover:shadow-md",
        !isOverlay && isDragging ? "opacity-0" : "opacity-100",
        cardStyle,
      )}
    >
      <CardContent className="space-y-2">
        <div className="flex justify-between items-start">
          <span
            className={cn(
              "text-[12px] font-mono text-muted-foreground border px-2 py-0.5",
              cardStyle,
            )}
          >
            {data.id_tiket}
          </span>

          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1">
              <Calendar className="size-3" />
              <span
                className={cn(
                  isToday
                    ? "text-emerald-600 text-[12px] font-bold"
                    : "text-[12px]",
                )}
              >
                {isToday
                  ? "Hari ini"
                  : createdDate.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-sm text-slate-800 tracking-tight">
            {data.nama_pelanggan}
          </h4>
          <p className="text-[16px] font-medium truncate text-slate-600 italic">
            {data.unit_laptop}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 mt-2">
            <div className="size-8 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold text-white shadow-sm overflow-hidden">
              {data.teknisi?.avatar_url ? (
                <img
                  src={data.teknisi.avatar_url}
                  alt={data.teknisi.name}
                  className="size-full object-cover"
                />
              ) : (
                <span>{data.teknisi?.name?.charAt(0) || "?"}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-700 leading-none">
                {data.teknisi?.name || "Belum Ditugaskan"}
              </span>
            </div>
          </div>

          <div className="flex">
            <Button
              size="sm"
              className="h-7 text-[12px] gap-1 my-2 px-2 bg-teal-500 hover:text-white dark:hover:text-slate-500"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://wa.me/${data.no_wa}`, "_blank");
              }}
            >
              <MessageCircle className="size-3" /> Chat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isOverlay) return cardUI;

  return (
    <div ref={setNodeRef} className="touch-none outline-none mb-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{cardUI}</DialogTrigger>
        <DialogDetailService
          data={data}
          onStartInspeksi={() => setOpen(false)}
          onClose={() => setOpen(false)}
        />
      </Dialog>
    </div>
  );
}
