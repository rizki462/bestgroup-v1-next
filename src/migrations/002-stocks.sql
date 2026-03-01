create table public.stocks (
  id serial not null,
  nama text,
  deskripsi text,
  harga_beli numeric,
  harga_jual numeric,
  image_url text,
  kategori text,
  jumlah numeric,
  is_available boolean,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);

alter table public.stocks enable row level security;