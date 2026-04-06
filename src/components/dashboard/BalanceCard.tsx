import { TrendingUp } from "lucide-react";

interface Props {
  balance: number;
  income: number;
  expenses: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

const BalanceCard = ({ balance, income, expenses }: Props) => {
  const changeAmount = income - expenses;
  const changePct = expenses > 0 ? ((changeAmount / expenses) * 100).toFixed(1) : "0.0";
  const isPositive = changeAmount >= 0;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-lg font-medium text-muted-foreground">Total Balance</h2>
      </div>

      <div className="flex items-end gap-3 mb-2">
        <span className="text-4xl font-bold text-foreground tracking-tight">
          {formatCurrency(balance)}
        </span>
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full mb-1 ${
            isPositive
              ? "bg-income text-income-foreground"
              : "bg-expense text-expense-foreground"
          }`}
        >
          {isPositive ? "+" : ""}
          {changePct}%
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Compared to expenses •{" "}
        {isPositive ? "+" : ""}
        {formatCurrency(changeAmount)}
      </p>

      <div className="flex items-center gap-1 text-primary">
        <TrendingUp className="w-8 h-8" strokeWidth={1.5} />
        <TrendingUp className="w-6 h-6 -ml-3 mt-1" strokeWidth={1.5} />
      </div>
    </div>
  );
};

export default BalanceCard;
