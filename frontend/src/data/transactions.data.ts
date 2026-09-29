import type { Transaction } from "../types/transaction.type";

export const transactions: Transaction[] = [
  {
    id: "tr1",
    title: "Стипендия",
    amount: 1500,
    type: "income",
    date: "2026-10-01",
    category: "Образование",
    note: "Ежемесячная академическая стипендия.",
  },
  {
    id: "tr2",
    title: "Проездной билет",
    amount: 300,
    type: "expense",
    date: "2026-10-02",
    category: "Транспорт",
    note: "Студенческий проездной на месяц.",
  },
  {
    id: "tr3",
    title: "Продукты на неделю",
    amount: 1200,
    type: "expense",
    date: "2026-10-04",
    category: "Питание",
    note: "Покупка продуктов в супермаркете.",
  },
  {
    id: "tr4",
    title: "Фриланс проект",
    amount: 3500,
    type: "income",
    date: "2026-10-06",
    category: "Работа",
    note: "Оплата за верстку лендинга.",
  },
  {
    id: "tr5",
    title: "Книги по разработке",
    amount: 850,
    type: "expense",
    date: "2026-10-08",
    category: "Учёба",
    note: "Учебное пособие по React и TypeScript.",
  },
];
