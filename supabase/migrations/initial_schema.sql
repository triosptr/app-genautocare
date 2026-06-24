create extension if not exists pgcrypto;

grant usage on schema public to authenticated;

create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  item_type text not null check (item_type in ('product', 'service')),
  sku text,
  category text not null default 'general',
  price numeric(12,2) not null default 0,
  cost numeric(12,2),
  stock_qty integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  vehicle_plate text,
  vehicle_model text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid,
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  payment_method text not null check (payment_method in ('cash', 'card', 'transfer', 'qris')),
  status text not null default 'completed' check (status in ('completed', 'refunded', 'void')),
  cashier_user_id text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null,
  catalog_item_id uuid,
  item_name text not null,
  item_type text not null check (item_type in ('product', 'service')),
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0
);

create index if not exists idx_catalog_items_category on public.catalog_items(category);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

alter table public.catalog_items enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

grant select, insert, update, delete on public.catalog_items to authenticated;
grant select, insert, update, delete on public.customers to authenticated;
grant select, insert, update, delete on public.orders to authenticated;
grant select, insert, update, delete on public.order_items to authenticated;

drop policy if exists "authenticated catalog access" on public.catalog_items;
create policy "authenticated catalog access"
on public.catalog_items
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated customer access" on public.customers;
create policy "authenticated customer access"
on public.customers
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated order access" on public.orders;
create policy "authenticated order access"
on public.orders
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated order item access" on public.order_items;
create policy "authenticated order item access"
on public.order_items
for all
to authenticated
using (true)
with check (true);

insert into public.catalog_items (name, item_type, sku, category, price, cost, stock_qty, is_active)
select * from (
  values
    ('Premium Wash', 'service', null, 'wash', 85000, null, null, true),
    ('Nano Coating', 'service', null, 'detailing', 350000, null, null, true),
    ('Tire Shine', 'product', 'PROD-TS-01', 'retail', 45000, 22000, 18, true),
    ('Cabin Sanitizer', 'service', null, 'interior', 125000, null, null, true)
) as seed(name, item_type, sku, category, price, cost, stock_qty, is_active)
where not exists (
  select 1
  from public.catalog_items
);

insert into public.customers (name, phone, vehicle_plate, vehicle_model, notes)
select * from (
  values
    ('Raka Pratama', '081234567890', 'B 1234 GAC', 'Toyota Yaris', 'Prefers morning bookings'),
    ('Nadia Kusuma', '081299988877', 'D 88 AUTO', 'Honda HR-V', 'Frequently adds detailing upsell')
) as seed(name, phone, vehicle_plate, vehicle_model, notes)
where not exists (
  select 1
  from public.customers
);
