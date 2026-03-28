CREATE TABLE public.warehouses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_gudang text NOT NULL,
    lokasi text,
    no_telp text,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- policy --
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;