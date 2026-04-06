import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Props {
  income: number;
  expenses: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const StatCards = ({ income, expenses }: Props) => {
  // Mock previous month values for % comparison (income +11%, expenses -4%)
  const prevIncome = income / 1.11;
  const incomePct = (((income - prevIncome) / prevIncome) * 100).toFixed(0);

  const prevExpenses = expenses / 0.96;
  const expensePct = (((expenses - prevExpenses) / prevExpenses) * 100).toFixed(0);
  const expenseIsUp = expenses > prevExpenses;

  return (
    <div className="flex flex-col gap-4">
      {/* Income Card */}
      <div className="bg-income rounded-2xl p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm font-medium text-income-foreground/70">Income</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl font-bold text-income-foreground">
            {formatCurrency(income)}
          </span>
          <ArrowUpRight className="w-4 h-4 text-income-foreground" />
        </div>
        <p className="text-xs text-income-foreground/60">+{incomePct}% from last month</p>
      </div>

      {/* Expenses Card */}
      <div className="bg-expense rounded-2xl p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm font-medium text-expense-foreground/70">Expenses</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl font-bold text-expense-foreground">
            {formatCurrency(expenses)}
          </span>
          <ArrowDownRight className="w-4 h-4 text-expense-foreground" />
        </div>
        <p className="text-xs text-expense-foreground/60">
          {expenseIsUp ? "+" : ""}{expensePct}% from last month
        </p>
      </div>
    </div>
  );
};

export default StatCards;
