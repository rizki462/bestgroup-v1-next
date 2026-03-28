CREATE TABLE public.stock_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    request_number text UNIQUE NOT NULL,
    warehouse_id_from uuid REFERENCES public.warehouses(id),
    warehouse_id_to uuid REFERENCES public.warehouses(id),
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    requested_by uuid REFERENCES auth.users(id),
    approved_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now() NOT NULL
);

-- policy --
ALTER TABLE public.stock_requests ENABLE ROW LEVEL SECURITY;