CREATE TABLE public.inventory_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    categories_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    kode_barang text UNIQUE NOT NULL,
    nama_barang text NOT NULL,
    jenis_barang text NOT NULL CHECK (jenis_barang IN ('persediaan', 'non_persediaan', 'jasa', 'grup', 'varian')),
    harga_jual numeric DEFAULT 0,
    harga_beli numeric DEFAULT 0,
    deskripsi text,
    satuan text DEFAULT 'PCS',
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- function untuk membuat baris baru di stock balances saat ada barang baru --
CREATE OR REPLACE FUNCTION public.handle_new_inventory_item()
RETURNS TRIGGER AS $$
BEGIN
    -- Masukkan barang ke setiap gudang yang sudah ada dengan stok 0
    INSERT INTO public.stock_balances (item_id, warehouse_id, qty)
    SELECT NEW.id, id, 0 FROM public.warehouses;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- trigger ---
CREATE TRIGGER on_inventory_item_created
AFTER INSERT ON public.inventory_items
FOR EACH ROW EXECUTE FUNCTION public.handle_new_inventory_item();

-- policy --
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;