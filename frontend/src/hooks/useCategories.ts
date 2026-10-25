import { useEffect, useState } from "react";
import type { Category } from "../types/category.types";
import { getCategories } from "../services/categories";

type CategoriesLoad =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: Category[] };

export function useCategories() {
  const [load, setLoad] = useState<CategoriesLoad>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setLoad({ status: "loading" });

    getCategories(controller.signal)
      .then((data) => {
        if (active) setLoad({ status: "success", data });
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message =
          error instanceof Error
            ? error.message
            : "Не удалось загрузить справочник.";
        setLoad({ status: "error", message });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt]);

  function retry() {
    setLoad({ status: "loading" });
    setAttempt((current) => current + 1);
  }

  return { load, retry };
}
