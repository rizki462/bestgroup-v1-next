import z from 'zod';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const loginSchemaForm = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  avatar_url: z
    .union([
      z.string(), // Untuk handling URL yang sudah ada (edit mode)
      z.any() // Penampung sementara untuk File
        .refine((file) => file instanceof File, "Data harus berupa file.")
        .refine((file) => file.size <= MAX_FILE_SIZE, "Ukuran maksimal 2MB.")
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
          "Format file tidak didukung."
        ),
    ])
    .optional()
    .or(z.literal("")),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  avatar_url: z
    .union([
      z.string(), // Untuk handling URL yang sudah ada (edit mode)
      z.any() // Penampung sementara untuk File
        .refine((file) => file instanceof File, "Data harus berupa file.")
        .refine((file) => file.size <= MAX_FILE_SIZE, "Ukuran maksimal 2MB.")
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
          "Format file tidak didukung."
        ),
    ])
    .optional()
    .or(z.literal("")),
});

export type LoginForm = z.infer<typeof loginSchemaForm>;
export type CreateUserForm = z.infer<typeof createUserSchema>;
export type EditUserForm = z.infer<typeof updateUserSchema>;
