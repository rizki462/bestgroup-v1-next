-- CREATE table profiles --
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  name text,
  role text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);

alter table public.profiles enable row level security;

-- RLS Policy untuk allow select
create policy "Allow user to view their profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

-- RLS Policy untuk allow update
create policy "Allow user to update their profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- RLS Policy untuk allow service_role full access (triggers, functions)
create policy "Service role can manage all profiles"
  on public.profiles for all
  to service_role
  using (true)
  with check (true);


create function public.handle_new_user() 
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, role, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'role', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$$;

-- triger the function every time a user created --
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- delete --
create function public.handle_delete_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  delete from public.profiles where id = old.id;
  return old;
end;
$$;

-- trigger the function every time a user is deleted --
create trigger on_auth_user_deleted
  after delete on auth.users
  for each row execute procedure public.handle_delete_user();