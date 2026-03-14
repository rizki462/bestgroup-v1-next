"use client";

import KanbanBoard from "./kanban-board";
import DialogAddTicket from "./dialog-add-ticket";
import { useQueryClient } from "@tanstack/react-query";

export default function ServicePage() {
  const queryClient = useQueryClient();

  const handleRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ["services-kanban"] });
  };

  return (
    <div className="flex flex-col gap-6 w-full p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kanban Board Service</h1>
          <p className="text-muted-foreground text-sm">
            Drag and drop tiket untuk melakukan perubahan status
          </p>
        </div>
        <DialogAddTicket refetch={handleRefetch} />
      </div>

      <KanbanBoard />
    </div>
  );
}