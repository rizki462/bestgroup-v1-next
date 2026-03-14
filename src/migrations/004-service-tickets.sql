create table public.services (
  id uuid default gen_random_uuid() primary key,
  id_tiket text not null unique,
  nama_pelanggan text not null,
  no_wa text not null,
  unit_laptop text not null,
  keluhan text not null,
  catatan_teknisi text,
  teknisi text,
  status text not null default 'antrian',
  total_biaya bigint default 0,
  outlet_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Mengaktifkan Row Level Security (RLS)
alter table public.services enable row level security;

-- Membuat Policy agar semua user yang terotentikasi bisa baca/tulis (sesuaikan kebutuhan)
create policy "Allow all authenticated users" on public.services
  for all using (auth.role() = 'authenticated');