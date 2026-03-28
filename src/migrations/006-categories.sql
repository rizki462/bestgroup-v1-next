CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_kategori text NOT NULL UNIQUE,
    deskripsi text,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- policy --
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;