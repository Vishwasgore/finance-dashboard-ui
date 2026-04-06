import { useState } from "react";
import { Pencil, Trash2, Search, X, ChevronUp, ChevronDown, ShoppingBag, Download } from "lucide-react";
import { Transaction, TransactionCategory, CATEGORIES } from "@/data/transactions";
import { Filters, SortKey } from "@/store/useDashboardState";
import AddTransactionDialog from "./AddTransactionDialog";

interface Props {
  role: "viewer" | "admin";
  transactions: Transaction[];
  totalCount: number;
  filters: Filters;
  onFilterChange: (patch: Partial<Filters>) => void;
  onResetFilters: () => void;
  onAdd: (tx: Omit<Transaction, "id">) => void;
  onEdit: (id: string, changes: Partial<Omit<Transaction, "id">>) => void;
  onDelete: (id: string) => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Inline edit row state
interface EditState {
  merchant: string;
  category: TransactionCategory;
  amount: string;
  status: "Processed" | "Pending";
}

const TransactionsTable = ({
  role,
  transactions,
  totalCount,
  filters,
  onFilterChange,
  onResetFilters,
  onAdd,
  onEdit,
  onDelete,
}: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const isFiltered =
    filters.search !== "" ||
    filters.type !== "all" ||
    filters.category !== "all";

  function startEdit(tx: Transaction) {
    setDeleteConfirmId(null); // clear any pending delete to avoid two rows in action-mode
    setEditingId(tx.id);
    setEditState({
      merchant: tx.merchant,
      category: tx.category,
      amount: String(tx.amount),
      status: tx.status,
    });
  }

  function commitEdit(id: string) {
    if (!editState) return;
    const amount = parseFloat(editState.amount);
    if (isNaN(amount) || amount <= 0) return;
    onEdit(id, {
      merchant: editState.merchant.trim(),
      category: editState.category,
      amount,
      status: editState.status,
    });
    setEditingId(null);
    setEditState(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditState(null);
  }

  function requestDelete(id: string) {
    cancelEdit(); // clear any active inline edit to avoid two rows in action-mode
    setDeleteConfirmId(id);
  }

  function toggleSort(key: SortKey) {
    if (filters.sortBy === key) {
      onFilterChange({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      onFilterChange({ sortBy: key, sortOrder: "desc" });
    }
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (filters.sortBy !== col) return <ChevronDown className="w-3 h-3 opacity-30 inline ml-0.5" />;
    return filters.sortOrder === "asc"
      ? <ChevronUp className="w-3 h-3 inline ml-0.5" />
      : <ChevronDown className="w-3 h-3 inline ml-0.5" />;
  };

  const inputClass =
    "rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow";

  function exportToCSV() {
    const headers = ["Date", "Merchant", "Category", "Type", "Amount", "Status"];
    const rows = transactions.map((t) => [
      t.date,
      `"${t.merchant.replace(/"/g, '""')}"`,
      t.category,
      t.type,
      t.type === "income" ? t.amount : -t.amount,
      t.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `atlas-transactions.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">Recent transactions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Showing {transactions.length} of {totalCount}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              id="tx-search"
              type="text"
              placeholder="Search merchant or category…"
              className="pl-8 pr-3 py-1.5 rounded-md border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow w-52"
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: "" })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Type filter */}
          <select
            id="tx-type-filter"
            className={inputClass}
            value={filters.type}
            onChange={(e) => onFilterChange({ type: e.target.value as Filters["type"] })}
          >
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Category filter */}
          <select
            id="tx-category-filter"
            className={inputClass}
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value as Filters["category"] })}
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Reset */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          )}

          {/* Export CSV */}
          <button
            id="export-csv-btn"
            onClick={exportToCSV}
            title="Export to CSV"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>

          {/* Admin: Add button */}
          {role === "admin" && <AddTransactionDialog onAdd={onAdd} />}
        </div>
      </div>

      {/* Empty state */}
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No transactions found</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isFiltered ? "Try adjusting your filters." : "Add a transaction to get started."}
            </p>
          </div>
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="text-xs text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase tracking-wider">
                <th
                  className="text-left pb-3 font-medium cursor-pointer hover:text-foreground transition-colors select-none"
                  onClick={() => toggleSort("date")}
                >
                  Date <SortIcon col="date" />
                </th>
                <th className="text-left pb-3 font-medium">Merchant</th>
                <th className="text-left pb-3 font-medium">Category</th>
                <th
                  className="text-right pb-3 font-medium cursor-pointer hover:text-foreground transition-colors select-none"
                  onClick={() => toggleSort("amount")}
                >
                  Amount <SortIcon col="amount" />
                </th>
                <th className="text-right pb-3 font-medium">Status</th>
                {role === "admin" && (
                  <th className="text-right pb-3 font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="text-sm">
              {transactions.map((tx) => {
                const isEditing = editingId === tx.id;
                const isConfirmingDelete = deleteConfirmId === tx.id;

                return (
                  <tr
                    key={tx.id}
                    className={`border-t border-border transition-colors ${
                      isEditing
                        ? "bg-secondary/70"
                        : tx.type === "income"
                        ? "bg-income/20 hover:bg-income/30"
                        : "hover:bg-secondary/50"
                    }`}
                  >
                    {/* Date */}
                    <td className="py-3.5 text-muted-foreground whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>

                    {/* Merchant */}
                    <td className="py-3.5 font-medium text-foreground max-w-[180px]">
                      {isEditing ? (
                        <input
                          className="w-full rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                          value={editState!.merchant}
                          onChange={(e) =>
                            setEditState((s) => s && { ...s, merchant: e.target.value })
                          }
                        />
                      ) : (
                        <span className="truncate block">{tx.merchant}</span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 text-muted-foreground">
                      {isEditing ? (
                        <select
                          className="rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none"
                          value={editState!.category}
                          onChange={(e) =>
                            setEditState(
                              (s) => s && { ...s, category: e.target.value as TransactionCategory }
                            )
                          }
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      ) : (
                        tx.category
                      )}
                    </td>

                    {/* Amount */}
                    <td className={`py-3.5 text-right font-medium ${tx.type === "income" ? "text-income-foreground" : "text-foreground"}`}>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          className="w-24 rounded border border-border bg-background px-2 py-1 text-xs text-right focus:outline-none focus:ring-1 focus:ring-primary/30"
                          value={editState!.amount}
                          onChange={(e) =>
                            setEditState((s) => s && { ...s, amount: e.target.value })
                          }
                        />
                      ) : (
                        <>
                          {tx.type === "income" ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 text-right">
                      {isEditing ? (
                        <select
                          className="rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none"
                          value={editState!.status}
                          onChange={(e) =>
                            setEditState(
                              (s) => s && { ...s, status: e.target.value as "Processed" | "Pending" }
                            )
                          }
                        >
                          <option value="Processed">Processed</option>
                          <option value="Pending">Pending</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            tx.status === "Processed"
                              ? "bg-income text-income-foreground"
                              : "bg-expense text-expense-foreground"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              tx.status === "Processed"
                                ? "bg-income-foreground"
                                : "bg-expense-foreground"
                            }`}
                          />
                          {tx.status}
                        </span>
                      )}
                    </td>

                    {/* Admin Actions */}
                    {role === "admin" && (
                      <td className="py-3.5 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => commitEdit(tx.id)}
                              className="px-2 py-1 rounded text-xs bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-2 py-1 rounded text-xs border border-border hover:bg-secondary transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : isConfirmingDelete ? (
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-xs text-muted-foreground mr-1">Delete?</span>
                            <button
                              onClick={() => {
                                onDelete(tx.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-2 py-1 rounded text-xs bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded text-xs border border-border hover:bg-secondary transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              id={`edit-${tx.id}`}
                              title="Edit transaction"
                              onClick={() => startEdit(tx)}
                              className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                            <button
                              id={`delete-${tx.id}`}
                              title="Delete transaction"
                              onClick={() => requestDelete(tx.id)}
                              className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
