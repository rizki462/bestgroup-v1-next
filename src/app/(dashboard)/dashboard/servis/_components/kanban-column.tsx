'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import KanbanCard from "./kanban-card";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function KanbanColumn({ id, title, count, items }: any) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="flex flex-col w-80 min-w-[320px] bg-slate-50/50 rounded-xl border h-full overflow-hidden">
      <div className="p-4 flex justify-between items-center bg-white/50 border-b">
        <h3 className="font-bold text-[10px] text-slate-500 uppercase">{title}</h3>
        <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{count}</span>
      </div>
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <SortableContext items={items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="p-4 flex flex-col gap-3">
              {items.map((item: any) => (
                <KanbanCard key={item.id} data={item} />
              ))}
              <button className="py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-medium hover:bg-teal-50 transition-colors">
                + Tambah Unit
              </button>
            </div>
          </SortableContext>
        </ScrollArea>
      </div>
    </div>
  );
}