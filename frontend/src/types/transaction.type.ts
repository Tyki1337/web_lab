export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
  note?: string;
};
export type TransactionCardProps = {
  transaction: Transaction;
};
export type TransactionDraft = Omit<Transaction, "id">;
