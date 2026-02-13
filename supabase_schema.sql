-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Roles Enum
create type user_role as enum ('super_admin', 'agency_owner', 'player');

-- Profiles Table (Users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  role user_role default 'player',
  full_name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Agencies Table
create table agencies (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references profiles(id),
  name text not null,
  address text,
  whatsapp_number text,
  mp_access_token text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Customers Table (Manually added by Agency)
create table customers (
  id uuid default uuid_generate_v4() primary key,
  agency_id uuid references agencies(id),
  full_name text not null,
  phone_number text not null,
  balance decimal(10, 2) default 0.00,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bets Table
create table bets (
  id uuid default uuid_generate_v4() primary key,
  agency_id uuid references agencies(id),
  customer_id uuid references customers(id), -- Nullable if anonymous walk-in
  profile_id uuid references profiles(id), -- Nullable if not a registered app user
  lottery text not null,
  number text not null,
  location text not null,
  amount decimal(10, 2) not null,
  possible_prize decimal(10, 2) not null,
  status text check (status in ('pending', 'won', 'lost', 'cancelled')) default 'pending',
  origin text check (origin in ('counter', 'whatsapp', 'web')) default 'counter',
  payment_method text check (payment_method in ('cash', 'mp', 'balance')) default 'cash',
  mp_payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Lottery Results Table
create table lottery_results (
  id uuid default uuid_generate_v4() primary key,
  lottery_name text not null, -- Nacional, Provincia, etc.
  lottery_type text not null, -- Primera, Matutina, etc.
  draw_date date not null default CURRENT_DATE,
  numbers integer[] not null, -- Array of 20 numbers
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (lottery_name, lottery_type, draw_date)
);

-- RLS Policies (Row Level Security) would appear here
-- For rapid dev, we'll assume Authenticated access for now, but RLS is critical for Prod.
