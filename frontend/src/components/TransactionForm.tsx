import { useState, type SyntheticEvent } from "react";
import type { TransactionDraft, TransactionType } from "../types/transaction.type";
import { useCategories } from "../hooks/useCategories";

type TransactionFormProps = {
  initialValues: TransactionDraft;
  onSave: (draft: TransactionDraft) => void;
  onCancel: () => void;
};

export function TransactionForm({
  initialValues,
  onSave,
  onCancel,
}: TransactionFormProps) {
  const [draft, setDraft] = useState<TransactionDraft>(() => ({
    ...initialValues,
  }));
  const [error, setError] = useState<string>("");

  const { load, retry } = useCategories();
  const categories = load.status === "success" ? load.data : [];
  
  const selectedCategoryExists = categories.some(
    (cat) => cat.id === draft.category
  );

  const canSave = load.status === "success" && categories.length > 0;

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    // 1. Проверка состояния загрузки справочника
    if (load.status !== "success") {
      setError("Дождитесь загрузки справочника категорий.");
      return;
    }

    // 2. Уведомление, если категория не выбрана (выбрана пустая строка "")
    if (!draft.category || draft.category.trim() === "") {
      setError("Укажите категорию (выберите вариант из списка).");
      return;
    }

    // 3. Уведомление, если выбран несуществующий/удаленный из базы ID
    if (!selectedCategoryExists) {
      setError("Выбранная категория недоступна. Пожалуйста, выберите вариант из списка.");
      return;
    }

    const title = draft.title.trim();
    const amountNum = Number(draft.amount);

    // Валидация названия
    if (title.length < 3 || title.length > 100) {
      setError("Название транзакции должно содержать от 3 до 100 символов.");
      return;
    }

    // Валидация суммы
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setError("Сумма должна быть положительным числом больше 0.");
      return;
    }

    // Валидация даты
    if (!draft.date) {
      setError("Укажите дату транзакции.");
      return;
    }

    setError("");
    onSave({
      ...draft,
      title,
      amount: amountNum,
      category: draft.category,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="transaction-form">
      {/* Название */}
      <div className="form-group">
        <label htmlFor="tx-title">Название</label>
        <input
          id="tx-title"
          type="text"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          required
        />
      </div>

      {/* Сумма */}
      <div className="form-group">
        <label htmlFor="tx-amount">Сумма</label>
        <input
          id="tx-amount"
          type="number"
          step="10"
          value={draft.amount || ""}
          onChange={(e) =>
            setDraft({ ...draft, amount: parseFloat(e.target.value) || 0 })
          }
          required
        />
      </div>

      {/* Тип операции */}
      <div className="form-group">
        <label htmlFor="tx-type">Тип операции</label>
        <select
          id="tx-type"
          value={draft.type}
          onChange={(e) =>
            setDraft({ ...draft, type: e.target.value as TransactionType })
          }
        >
          <option value="expense">Расход</option>
          <option value="income">Доход</option>
        </select>
      </div>

      {/* Категория */}
      <div className="form-group">
        <label htmlFor="tx-category">Категория</label>
        <select
          id="tx-category"
          value={draft.category}
          required
          disabled={load.status !== "success" || categories.length === 0}
          onChange={(e) => setDraft({ ...draft, category: e.target.value })}
        >
          <option value="">-- Выберите категорию --</option>
          
          {/* Если открыли на редактирование запись со старым/удаленным кодом */}
          {draft.category !== "" && !selectedCategoryExists && (
            <option value={draft.category} disabled>
              Недоступный код: {draft.category}
            </option>
          )}

          {/* Доступные опции из Supabase */}
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Индикаторы загрузки и ошибок справочника */}
      {load.status === "loading" && (
        <p role="status">Загружаем категории из Supabase...</p>
      )}

      {load.status === "error" && (
        <div>
          <p role="alert" style={{ color: "red" }}>
            {load.message}
          </p>
          <button type="button" onClick={retry}>
            Повторить
          </button>
        </div>
      )}

      {load.status === "success" && categories.length === 0 && (
        <div>
          <p role="status">Категорий пока нет. Сохранение недоступно.</p>
          <button type="button" onClick={retry}>
            Повторить
          </button>
        </div>
      )}

      {/* Кнопка принудительного обновления */}
      {load.status === "success" && categories.length > 0 && (
        <button 
          type="button" 
          onClick={retry} 
          style={{ marginBottom: "15px" }}
        >
          Обновить справочник
        </button>
      )}

      {/* Дата */}
      <div className="form-group">
        <label htmlFor="tx-date">Дата</label>
        <input
          id="tx-date"
          type="date"
          value={draft.date}
          onChange={(e) => setDraft({ ...draft, date: e.target.value })}
          required
        />
      </div>

      {/* Вывод всех ошибок формы */}
      {error && (
        <p role="alert" className="error-message" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* Кнопки */}
      <div className="form-actions">
        <button type="submit" disabled={!canSave}>
          Сохранить
        </button>
        <button type="button" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
}