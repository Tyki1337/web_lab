insert into public.categories (id, name)
values
  ('food', 'Еда и продукты'),
  ('transport', 'Транспорт'),
  ('housing', 'Коммуналка и жильё'),
  ('entertainment', 'Развлечения'),
  ('salary', 'Зарплата')
on conflict (id) do update
set name = excluded.name;