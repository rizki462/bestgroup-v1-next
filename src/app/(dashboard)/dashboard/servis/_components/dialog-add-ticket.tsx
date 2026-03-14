"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useState, startTransition } from "react";
import { toast } from "sonner";
import { CreateTicketForm, createTicketServiceSchema } from "@/validations/service-validation";
import { INITIAL_CREATE_TICKET_FORM, INITIAL_STATE_CREATE_TICKET } from "@/constants/service-constant";
import { createService } from "../actions";
import FormService from "../form-service";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DialogAddTicket({ refetch }: { refetch: () => void }) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateTicketForm>({
    resolver: zodResolver(createTicketServiceSchema),
    defaultValues: INITIAL_CREATE_TICKET_FORM,
  });

  const [state, createTicketAction, isPending] = useActionState(createService, INITIAL_STATE_CREATE_TICKET);

  const onSubmit = form.handleSubmit(
  (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    startTransition(() => {
      createTicketAction(formData);
    });
  },
  (errors) => {
    toast.error("Form belum lengkap", {
      description: "Silakan cek kembali inputan yang merah",
    });
  }
);

  useEffect(() => {
    if (state?.status === "error") {
      toast.error("Gagal Menambah Tiket", {
        description: state.message || "Pastikan semua field terisi benar",
      });
    }

    if (state?.status === "success") {
      toast.success("Tiket Servis Berhasil Dibuat");
      form.reset();
      setOpen(false); 
      refetch(); 
    }
  }, [state, form, refetch]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus className="mr-2 h-4 w-4" /> Add New Ticket
        </Button>
      </DialogTrigger>
      
      <FormService
        form={form}
        onSubmit={onSubmit}
        isLoading={isPending}
        type="Create"
      />
    </Dialog>
  );
}