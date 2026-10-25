-- 1. Создаем справочник категорий
create table public.categories (
  id text primary key,
  name text not null unique,
  constraint categories_id_not_blank check (id = btrim(id) and id <> ''),
  constraint categories_name_not_blank check (name = btrim(name) and name <> '')
);

-- 2. Создаем личную таблицу транзакций (пока пустая, ждет auth.users в ЛР 6)
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  category_id text not null references public.categories(id) on update cascade on delete restrict,
  title text not null,
  amount numeric(12, 2) not null,
  type text not null,
  date date not null,
  created_at timestamptz not null default now(),
  constraint transactions_title_length check (char_length(btrim(title)) between 3 and 100),
  constraint transactions_amount_positive check (amount > 0),
  constraint transactions_type_allowed check (type in ('expense', 'income'))
);

-- 3. Включаем RLS на обеих таблицах
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

-- 4. Настраиваем права (REVOKE / GRANT)
revoke all on table public.categories from anon, authenticated;
revoke all on table public.transactions from anon, authenticated;

grant select on table public.categories to anon, authenticated;

-- 5. Политика публичного чтения для справочника
create policy "categories are publicly readable"
on public.categories
for select
to anon, authenticated
using (true);