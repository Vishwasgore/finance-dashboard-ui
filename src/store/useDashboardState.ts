import { useState, useEffect, useMemo } from "react";
import { Transaction, TransactionType, TransactionCategory, initialTransactions } from "@/data/transactions";

export type SortKey = "date" | "amount";
export type SortOrder = "asc" | "desc";

// "YYYY-MM" format, or "all" to show every month
export type SelectedMonth = string | "all";

// Build a dynamic month list from actual transaction data + the current calendar month
export function buildAvailableMonths(
  transactions: { date: string }[]
): { value: SelectedMonth; label: string }[] {
  const monthSet = new Set<string>();

  // Always include the current month so freshly-added transactions are always reachable
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  monthSet.add(currentKey);

  transactions.forEach((t) => {
    monthSet.add(t.date.slice(0, 7));
  });

  const sorted = Array.from(monthSet).sort((a, b) => b.localeCompare(a));

  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

  return [
    { value: "all", label: "All months" },
    ...sorted.map((key) => ({
      value: key as SelectedMonth,
      label: fmt.format(new Date(`${key}-01`)),
    })),
  ];
}

export interface Filters {
  search: string;
  type: TransactionType | "all";
  category: TransactionCategory | "all";
  sortBy: SortKey;
  sortOrder: SortOrder;
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  type: "all",
  category: "all",
  sortBy: "date",
  sortOrder: "desc",
};

// Derive simple insights from the transaction list
function deriveInsights(transactions: Transaction[]) {
  const expenses = transactions.filter((t) => t.type === "expense");

  // Tally spending per category
  const byCategory: Record<string, number> = {};
  expenses.forEach((t) => {
    byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;
  });

  const topCategory =
    Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0] ?? null;

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  // Avg daily spend (based on 30 days)
  const avgDailySpend = totalExpenses / 30;

  // Count pending transactions as "bills due"
  const pendingCount = transactions.filter((t) => t.status === "Pending").length;

  // Previous month comparison — mock a 10% increase for expenses
  const prevMonthExpenses = totalExpenses * 0.9;
  const expenseChangePct = ((totalExpenses - prevMonthExpenses) / prevMonthExpenses) * 100;

  return {
    topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
    totalExpenses,
    avgDailySpend,
    pendingCount,
    expenseChangePct,
  };
}

// Aggregate transactions into monthly chart data.
// Dynamically picks the 6 most recent months that appear in the data
// so the chart always reflects real transactions — no hardcoded month keys.
function buildChartData(transactions: Transaction[]) {
  // Collect every unique "YYYY-MM" that has at least one transaction
  const monthSet = new Set<string>();
  transactions.forEach((t) => monthSet.add(t.date.slice(0, 7)));

  // Sort descending (newest first), take up to 6, then reverse for chart order
  const sortedMonths = Array.from(monthSet)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 6)
    .reverse();

  // If fewer than 6 months of data, pad with earlier synthetic months
  while (sortedMonths.length < 6) {
    const [year, month] = sortedMonths[0].split("-").map(Number);
    const prevDate = new Date(year, month - 2, 1); // one month earlier
    const prevKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
    sortedMonths.unshift(prevKey);
  }

  // Aggregate income & expenses per month
  const map: Record<string, { income: number; expenses: number }> = {};
  sortedMonths.forEach((k) => (map[k] = { income: 0, expenses: 0 }));
  transactions.forEach((t) => {
    const key = t.date.slice(0, 7);
    if (!map[key]) return;
    if (t.type === "income") map[key].income += t.amount;
    else map[key].expenses += t.amount;
  });

  // Format month labels
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short" });

  return sortedMonths.map((key) => ({
    month: fmt.format(new Date(`${key}-01`)),
    income: Math.round(map[key].income),
    expenses: Math.round(map[key].expenses),
  }));
}

// Use timestamp + random suffix — survives page reloads without ID collisions
function generateId() {
  return `txn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const STORAGE_KEY = "atlas_transactions";

function loadTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Transaction[];
  } catch {
    // corrupted storage — fall back to defaults
  }
  return initialTransactions;
}

export function useDashboardState() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);
  const [role, setRole] = useState<"viewer" | "admin">("viewer");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  // Default to Sep 2024 — the month with most mock data
  const [selectedMonth, setSelectedMonth] = useState<SelectedMonth>("2024-09");

  // Dynamic month list — recalculated whenever transactions change
  const availableMonths = useMemo(() => buildAvailableMonths(transactions), [transactions]);

  // Persist transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Transactions scoped to the selected month (used for all summary figures)
  const monthScopedTransactions = useMemo(() => {
    if (selectedMonth === "all") return transactions;
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Filtered + sorted transaction list (month scope + search/type/category/sort)
  const filteredTransactions = useMemo(() => {
    let result = [...monthScopedTransactions];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.merchant.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type);
    }

    if (filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category);
    }

    result.sort((a, b) => {
      if (filters.sortBy === "date") {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return filters.sortOrder === "asc" ? diff : -diff;
      } else {
        const diff = a.amount - b.amount;
        return filters.sortOrder === "asc" ? diff : -diff;
      }
    });

    return result;
  }, [monthScopedTransactions, filters]);

  // Summary figures scoped to selected month
  const totalIncome = useMemo(
    () => monthScopedTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [monthScopedTransactions]
  );

  const totalExpenses = useMemo(
    () => monthScopedTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    [monthScopedTransactions]
  );

  const totalBalance = totalIncome - totalExpenses;

  const insights = useMemo(() => deriveInsights(monthScopedTransactions), [monthScopedTransactions]);
  // Chart always shows the full 6-month view regardless of month filter
  const chartData = useMemo(() => buildChartData(transactions), [transactions]);

  // CRUD operations
  function addTransaction(tx: Omit<Transaction, "id">) {
    setTransactions((prev) => [{ ...tx, id: generateId() }, ...prev]);
    // Automatically switch to the month of the new transaction so it's immediately visible
    const newMonth = tx.date.slice(0, 7);
    setSelectedMonth(newMonth);
    setFilters(DEFAULT_FILTERS);
  }

  function updateTransaction(id: string, changes: Partial<Omit<Transaction, "id">>) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...changes } : t))
    );
  }

  function deleteTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function updateFilters(patch: Partial<Filters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  function changeMonth(month: SelectedMonth) {
    setSelectedMonth(month);
    // Reset table-level filters when switching months so results aren't confusing
    setFilters(DEFAULT_FILTERS);
  }

  return {
    // State
    transactions,
    monthScopedTransactions,
    filteredTransactions,
    availableMonths,
    role,
    filters,
    selectedMonth,
    // Summary
    totalBalance,
    totalIncome,
    totalExpenses,
    insights,
    chartData,
    // Actions
    setRole,
    changeMonth,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateFilters,
    resetFilters,
  };
}
