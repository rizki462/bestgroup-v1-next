CREATE TABLE public.stock_balances (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id uuid REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    warehouse_id uuid REFERENCES public.warehouses(id) ON DELETE CASCADE,
    qty numeric DEFAULT 0,
    min_stock numeric DEFAULT 0,
    max_stock numeric DEFAULT 0,
    UNIQUE(item_id, warehouse_id) -- Satu barang per satu gudang
);

-- policy --
ALTER TABLE public.stock_balances ENABLE ROW LEVEL SECURITY;