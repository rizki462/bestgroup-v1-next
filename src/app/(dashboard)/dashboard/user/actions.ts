"use server";

import { uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/types/auth";
import { createUserSchema } from "@/validations/auth-validation";

export async function createUser(prevState: AuthFormState, formData: FormData) {
  let validateFields = createUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
    role: formData.get("role"),
    avatar_url: formData.get("avatar_url"),
  });

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  if (validateFields.data.avatar_url instanceof File) {
    const { errors, data } = await uploadFile(
      "images",
      "users",
      validateFields.data.avatar_url,
    );

    if (errors) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: [...errors._form]
        },
      };
    }

    validateFields = {
      ...validateFields,
      data: {
        ...validateFields.data,
        avatar_url: data.path,
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: validateFields.data.email,
    password: validateFields.data.password,
    options: {
      data: {
        name: validateFields.data.name,
        role: validateFields.data.role,
        avatar_url: validateFields.data.avatar_url,
      },
    },
  });

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
    errors: {
      email: [],
      password: [],
      name: [],
      role: [],
      avatar_url: [],
      _form: [],
    },
  };
}
