create table public.outlets (
  id serial not null,
  kode_outlet varchar(20) unique not null,
  nama text not null,
  alamat text not null,
  kota text not null,
  telepon varchar(20) not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  CONSTRAINT outlets_pkey PRIMARY KEY (id)

  primary key (id)
);

alter table public.outlets enable row level security;