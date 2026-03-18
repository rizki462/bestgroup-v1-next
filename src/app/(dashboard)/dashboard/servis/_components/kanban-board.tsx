"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import KanbanColumn from "./kanban-column";
import { Loader2 } from "lucide-react";
import { SERVICE_STATUS } from "@/constants/service-constant";
import { useEffect, useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { updateServiceStatus } from "../actions";
import { toast } from "sonner";
import KanbanCard from "./kanban-card";

export default function KanbanBoard() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [localServices, setLocalServices] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const {
    data: services,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["services-kanban"],
    queryFn: async () => {
      // Join ke inspection_services agar data inspeksi terbawa ke Card & Dialog
      const { data } = await supabase
        .from("services")
        .select(`
          *,
            inspection:inspection_services (*),
            teknisi:profiles!teknisi_id (name, avatar_url)        
          `)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  // --- LOGIKA REALTIME START ---
  useEffect(() => {
    const channelServices = supabase
      .channel("realtime_services")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "services" },
        () => refetch()
      )
      .subscribe();

    // Channel untuk tabel inspeksi agar saat SA simpan diagnosa, UI langsung update
    const channelInspection = supabase
      .channel("realtime_inspection")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inspection_services" },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelServices);
      supabase.removeChannel(channelInspection);
    };
  }, [supabase, refetch]);

  useEffect(() => {
    if (services) setLocalServices(services);
  }, [services]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const serviceId = active.id as string;
    const newStatus = over.id as string;

    setLocalServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status: newStatus } : s)),
    );

    const result = await updateServiceStatus(serviceId, newStatus);
    if (result.status === "error") {
      toast.error("Gagal update status");
      refetch();
    } else {
      queryClient.invalidateQueries({ queryKey: ["services-kanban"] });
    }
  };

  const activeService = useMemo(
    () => localServices.find((s) => s.id === activeId),
    [localServices, activeId],
  );

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-teal-500" />
      </div>
    );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-180px)] items-start">
        {Object.entries(SERVICE_STATUS).map(([key, value]) => {
          const columnItems = localServices.filter((s) => s.status === key);
          return (
            <KanbanColumn
              key={key}
              id={key}
              title={value}
              count={columnItems.length}
              items={columnItems}
            />
          );
        })}
      </div>

      <DragOverlay dropAnimation={{ duration: 100, easing: "ease" }}>
        {activeId && activeService ? (
          <div className="w-full opacity-90 shadow-2xl">
            <KanbanCard data={activeService} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}