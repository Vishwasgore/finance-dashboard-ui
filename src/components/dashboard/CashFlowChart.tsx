import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartDataPoint {
  month: string;
  income: number;
  expenses: number;
}

interface Props {
  chartData: ChartDataPoint[];
  isDark: boolean;
}

const CashFlowChart = ({ chartData, isDark }: Props) => {
  // Adapt colors to the current theme
  const incomeColor = isDark ? "hsl(210, 80%, 62%)" : "hsl(215, 50%, 15%)";
  const expenseColor = isDark ? "hsl(15, 60%, 62%)" : "hsl(15, 55%, 42%)";
  const gridColor = isDark ? "hsl(222, 15%, 22%)" : "hsl(220, 15%, 92%)";
  const tickColor = isDark ? "hsl(215, 10%, 52%)" : "hsl(215, 15%, 50%)";
  const tooltipBg = isDark ? "hsl(222, 18%, 13%)" : "hsl(0, 0%, 100%)";
  const tooltipBorder = isDark ? "hsl(222, 15%, 22%)" : "hsl(220, 15%, 90%)";
  const tooltipText = isDark ? "hsl(210, 15%, 90%)" : "hsl(215, 50%, 12%)";

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-foreground">
          Cash flow • Last 6 months
        </h3>
      </div>

      <div className="flex items-center gap-5 mb-6">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-expense-foreground" />
          <span className="text-xs text-muted-foreground">Expenses</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={incomeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={incomeColor} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={expenseColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={expenseColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: tickColor }}
          />
          <YAxis hide />
          <Tooltip
            formatter={(value: number, name: string) => [
              `$${value.toLocaleString()}`,
              name === "income" ? "Income" : "Expenses",
            ]}
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: "8px",
              fontSize: "13px",
              color: tooltipText,
            }}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke={incomeColor}
            strokeWidth={2}
            fill="url(#incomeGrad)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke={expenseColor}
            strokeWidth={2}
            fill="url(#expenseGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CashFlowChart;
