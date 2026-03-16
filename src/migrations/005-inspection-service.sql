create table public.inspection_services (
  id uuid default gen_random_uuid() primary key,
  service_id uuid not null unique references public.services(id) on delete cascade,
  
  -- Detail Inspeksi 14 Poin
  detail_inspeksi jsonb not null default '{}'::jsonb,
  
  -- Hasil Diagnosa & Estimasi
  keterangan_unit text, -- Fisik unit (baut kurang, lecet, dll)
  diagnosa_awal text not null,
  estimasi_harga bigint default 0,
  estimasi_waktu text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Policy
alter table public.inspection_services enable row level security;
create policy "Allow all authenticated users" on public.inspection_services
  for all using (auth.role() = 'authenticated');