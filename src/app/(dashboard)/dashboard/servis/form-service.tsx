"use client";

import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { CreateTicketForm } from "@/validations/service-validation";

interface FormServiceProps {
  form: UseFormReturn<CreateTicketForm>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
}

export default function FormService({
  form,
  onSubmit,
  isLoading,
  type,
}: FormServiceProps) {
  return (
    <DialogContent className="sm:max-w-106.25">
      <Form {...form}>
        <DialogHeader>
          <DialogTitle>{type} Tiket Servis</DialogTitle>
          <DialogDescription>
            {type === "Create"
              ? "Input data unit masuk untuk antrian baru"
              : "Perbarui detail servis unit"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <FormInput
            form={form}
            name="nama_pelanggan"
            label="Nama Pelanggan"
            placeholder="Masukkan nama pemilik"
          />

          <FormInput
            form={form}
            name="no_wa"
            label="Nomor WhatsApp"
            placeholder="0812xxxx"
          />

          <FormInput
            form={form}
            name="unit_laptop"
            label="Tipe Laptop"
            placeholder="Asus ROG GL553"
          />

          <FormInput
            form={form}
            name="keluhan"
            label="Keluhan"
            placeholder="Masukkan keluhan"
            type="textarea"
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : type === "Create" ? (
                "Buat Tiket"
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
