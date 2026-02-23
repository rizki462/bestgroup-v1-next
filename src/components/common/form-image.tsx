import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FileImage } from "lucide-react";
import { getImageData } from "@/lib/utils";

export default function FormImage<T extends FieldValues>({
  form,
  name,
  label,
  preview,
  setPriview,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  preview?: {
    file: File;
    displayUrl: string;
  };
  setPriview?: (preview: { file: File; displayUrl: string }) => void;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, ...rest } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9 rounded-lg">
                <AvatarImage src={preview?.displayUrl} alt="Preview" />
                <AvatarFallback className="rounded-lg">
                  <FileImage className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <Input
                type="file"
                name={rest.name} ref={rest.ref} onBlur={rest.onBlur} disabled={rest.disabled}
                onChange={async (e) => {
                    onChange(e);
                    const {file, displayUrl} = await getImageData(e);

                    if (file) {
                        setPriview?.({file, displayUrl});
                    }
                }}
              />
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
