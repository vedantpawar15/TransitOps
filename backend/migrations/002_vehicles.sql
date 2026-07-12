create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  registration_number text unique not null,
  name text not null,
  type text not null,
  max_load_capacity numeric not null,
  odometer numeric default 0,
  acquisition_cost numeric,
  status text not null default 'Available'
    check (status in ('Available','On Trip','In Shop','Retired')),
  region text,
  created_at timestamptz default now()
);
