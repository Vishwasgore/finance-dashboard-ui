import {
  UtensilsCrossed,
  BadgeDollarSign,
  Calendar,
  CalendarClock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface InsightData {
  topCategory: { name: string; amount: number } | null;
  totalExpenses: number;
  avgDailySpend: number;
  pendingCount: number;
  expenseChangePct: number;
}

interface Props {
  insights: InsightData;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const InsightsPanel = ({ insights }: Props) => {
  const { topCategory, totalExpenses, avgDailySpend, pendingCount, expenseChangePct } = insights;

  const dynamicInsights = [
    topCategory && {
      icon: UtensilsCrossed,
      message: `Highest spending: ${topCategory.name} at ${formatCurrency(topCategory.amount)} this month`,
      color: "text-expense-foreground bg-expense",
    },
    {
      icon: TrendingUp,
      message: `Total monthly expenses: ${formatCurrency(totalExpenses)} (${expenseChangePct > 0 ? "+" : ""}${expenseChangePct.toFixed(0)}% vs last month)`,
      color:
        expenseChangePct > 0
          ? "text-expense-foreground bg-expense"
          : "text-income-foreground bg-income",
    },
    {
      icon: BadgeDollarSign,
      message: `Avg daily spend is ${formatCurrency(avgDailySpend)} — ${
        avgDailySpend > 150 ? "consider cutting back this month" : "nicely in budget"
      }`,
      color: avgDailySpend > 150 ? "text-expense-foreground bg-expense" : "text-income-foreground bg-income",
    },
    pendingCount > 0 && {
      icon: AlertCircle,
      message: `${pendingCount} transaction${pendingCount > 1 ? "s" : ""} still pending — review before month end`,
      color: "text-expense-foreground bg-expense",
    },
  ].filter(Boolean) as {
    icon: React.ElementType;
    message: string;
    color: string;
  }[];

  return (
    <div className="flex flex-col gap-4">
      {/* Insights */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
        <div className="flex items-start gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Insights</h3>
            <p className="text-xs text-muted-foreground">This month at a glance</p>
          </div>
          <div className="ml-auto w-1 h-8 rounded-full bg-primary" />
        </div>

        <div className="space-y-3">
          {dynamicInsights.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`p-1.5 rounded-lg shrink-0 ${item.color}`}>
                <item.icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-sm text-foreground/80 leading-snug">{item.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
        <h3 className="text-base font-semibold text-foreground mb-3">Quick stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground leading-tight">Avg daily spend</p>
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(avgDailySpend)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary">
            <CalendarClock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground leading-tight">
                {pendingCount} bill{pendingCount !== 1 ? "s" : ""} pending
              </p>
              <p className="text-sm font-semibold text-foreground">this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
