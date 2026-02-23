import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { INITIAL_CREATE_USER_FORM, INITIAL_STATE_CREATE_USER } from "@/constants/auth-constant";
import {
  CreateUserForm,
  createUserSchema,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createUser } from "../actions";

export default function DialogCreateUser({ refetch }: { refetch: () => void }) {
  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: INITIAL_CREATE_USER_FORM,
  });

  const [createUserState, createUserAction, isPendingCreateUser] =
    useActionState(createUser, INITIAL_STATE_CREATE_USER);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createUserAction(formData);
    });
  });

  useEffect(() => {
    if (createUserState.status === "error") {
      toast.error("Create User Failed", {
        description: createUserState.errors?._form?.[0],
      });
    }

    if (createUserState?.status === "success") {
      toast.success("Create User Success");
      form.reset();
      document.querySelector<HTMLButtonElement>('[data-state="open"]');
      refetch();
    }
  }, [createUserState]);

  return (
    <DialogContent className="ms:max-w-[425px]">
      <Form {...form}>
        <DialogHeader>Create User</DialogHeader>
        <DialogDescription>Register a new User</DialogDescription>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormInput
            form={form}
            name="name"
            label="Name"
            placeholder="Insert your Name"
          />

          <FormInput
            form={form}
            name="role"
            label="Role"
            placeholder="Insert your Role (e.g., admin, user)"
          />

          <FormInput
            form={form}
            name="email"
            label="Email"
            placeholder="Insert your Email"
            type="email"
          />

          <FormInput
            form={form}
            name="password"
            label="Password"
            placeholder="********"
            type="password"
          />

          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPendingCreateUser}>
              {isPendingCreateUser ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
