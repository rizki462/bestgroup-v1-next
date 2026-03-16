'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import KanbanCard from "./kanban-card";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { getServiceStyle, SERVICE_STATUS_COLOR, STATUS_UI_STYLE } from "@/constants/service-constant";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  items: any[];
}

export default function KanbanColumn({ id, title, count, items }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  const { uiStyle } = getServiceStyle(id);
  const headerStyle = uiStyle.header;

  return (
    <div ref={setNodeRef} className="flex flex-col w-80 min-w-[320px] bg-slate-50/50 rounded-xl border h-full overflow-hidden">
      <div className={cn(
        "p-4 flex justify-between items-center bg-white/50 border-b",
        headerStyle
      )}>
        <h3 className="font-bold text-[12px] text-white tracking-widest uppercase">{title}</h3>
        <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{count}</span>
      </div>
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full bg-white">
          <SortableContext items={items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="p-4 flex flex-col gap-3">
              {items.map((item: any) => (
                <KanbanCard key={item.id} data={item} />
              ))}
            </div>
          </SortableContext>
        </ScrollArea>
      </div>
    </div>
  );
}