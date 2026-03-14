"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import KanbanColumn from "./kanban-column";
import { Loader2 } from "lucide-react";
import { SERVICE_STATUS, ServiceStatus } from "@/constants/service-constant";
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

  // State lokal untuk handle perpindahan kartu secara instan
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
      const { data } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  // --- LOGIKA REALTIME START ---
  useEffect(() => {
    const channel = supabase
      .channel("realtime_services")
      .on(
        "postgres_changes",
        {
          event: "*", // Set INSERT, UPDATE, dan DELETE
          schema: "public",
          table: "services",
        },
        () => {
          refetch();
        },
      )
      .subscribe();

    // Cleanup channel saat komponen tidak lagi digunakan (unmount)
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, refetch]);
  // --- LOGIKA REALTIME END ---

  // Sinkronkan data query ke state lokal
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

    // UPDATE INSTAN DI UI
    setLocalServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status: newStatus } : s)),
    );

    // UPDATE DI DATABASE (BACKGROUND)
    const result = await updateServiceStatus(serviceId, newStatus);
    if (result.status === "error") {
      toast.error("Gagal update status");
      refetch(); // Kembalikan ke status semula jika gagal
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
      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-180px)] no-scrollbar items-start">
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
          <div className="w-full opacity-90  shadow-2xl">
            <KanbanCard data={activeService} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
