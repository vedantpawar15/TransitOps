-- backend/migrations/001_users.sql

CREATE TABLE users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null default 'FleetManager',
  status text not null default 'Active',
  created_at timestamptz default now()
);
