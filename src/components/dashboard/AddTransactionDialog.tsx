import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Transaction, TransactionCategory, CATEGORIES } from "@/data/transactions";

interface Props {
  onAdd: (tx: Omit<Transaction, "id">) => void;
}

const defaultForm = {
  date: new Date().toISOString().slice(0, 10),
  merchant: "",
  category: "Groceries" as TransactionCategory,
  type: "expense" as "income" | "expense",
  amount: "",
  status: "Processed" as "Processed" | "Pending",
};

const AddTransactionDialog = ({ onAdd }: Props) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.merchant.trim()) return setError("Merchant name is required.");
    if (isNaN(amount) || amount <= 0) return setError("Enter a valid positive amount.");
    setError("");

    onAdd({
      date: form.date || new Date().toISOString().slice(0, 10),
      merchant: form.merchant.trim(),
      category: form.type === "income" ? "Income" : form.category,
      type: form.type,
      amount,
      status: form.status,
    });

    setForm(defaultForm);
    setOpen(false);
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

  const labelClass = "block text-xs font-medium text-muted-foreground mb-1";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          id="add-transaction-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Date */}
          <div>
            <label className={labelClass}>Date</label>
            <input
              className={inputClass}
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>

          {/* Merchant */}
          <div>
            <label className={labelClass}>Merchant</label>
            <input
              className={inputClass}
              placeholder="e.g. Whole Foods Market"
              value={form.merchant}
              onChange={(e) => setForm((f) => ({ ...f, merchant: e.target.value }))}
            />
          </div>

          {/* Type + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Type</label>
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    type: e.target.value as "income" | "expense",
                    category: e.target.value === "income" ? "Income" : "Groceries",
                  }))
                }
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select
                className={inputClass}
                value={form.type === "income" ? "Income" : form.category}
                disabled={form.type === "income"}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value as TransactionCategory }))
                }
              >
                {CATEGORIES.filter((c) =>
                  form.type === "income" ? c === "Income" : c !== "Income"
                ).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Amount ($)</label>
              <input
                className={inputClass}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as "Processed" | "Pending" }))
                }
              >
                <option value="Processed">Processed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setForm(defaultForm);
                setError("");
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
