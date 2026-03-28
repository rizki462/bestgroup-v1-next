CREATE TABLE public.stock_transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id uuid REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    warehouse_id uuid REFERENCES public.warehouses(id) ON DELETE CASCADE,
    stock_request_id uuid REFERENCES public.stock_requests(id) ON DELETE SET NULL,
    transaction_type text NOT NULL CHECK (transaction_type IN ('in', 'out', 'transfer', 'adjustment')),
    qty numeric NOT NULL,
    note text,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- policy --
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;