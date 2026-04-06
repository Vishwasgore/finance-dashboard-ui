import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Transaction } from "@/data/transactions";

// 10 distinct colors that work on both light and dark backgrounds
const CATEGORY_COLORS = [
  "#4f83cc", // blue
  "#e07b54", // orange-red
  "#5aab7a", // green
  "#c97bd1", // purple
  "#e8b84b", // amber
  "#4db8c8", // teal
  "#e06080", // rose
  "#7a8fcf", // indigo
  "#8cba6e", // lime
  "#cc8844", // brown
];

interface Props {
  transactions: Transaction[];
  isDark: boolean;
}

const SpendingBreakdown = ({ transactions, isDark }: Props) => {
  // Aggregate expenses by category
  const byCategory: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;
    });

  const data = Object.entries(byCategory)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const tooltipStyle = {
    backgroundColor: isDark ? "hsl(222, 18%, 13%)" : "hsl(0, 0%, 100%)",
    border: `1px solid ${isDark ? "hsl(222, 15%, 22%)" : "hsl(220, 15%, 90%)"}`,
    borderRadius: "8px",
    fontSize: "13px",
    color: isDark ? "hsl(210, 15%, 90%)" : "hsl(215, 50%, 12%)",
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Spending Breakdown</h3>
        <p className="text-xs text-muted-foreground">Expenses by category this period</p>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
          No expense data for this period.
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Donut chart */}
          <div className="w-full sm:w-auto shrink-0">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toFixed(2)}`,
                    "Spent",
                  ]}
                  contentStyle={tooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend with share bars */}
          <div className="flex-1 w-full space-y-2.5">
            {data.map((entry, i) => {
              const pct = total > 0 ? (entry.value / total) * 100 : 0;
              return (
                <div key={entry.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                      />
                      <span className="font-medium text-foreground">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>${entry.value.toFixed(0)}</span>
                      <span className="w-8 text-right">{pct.toFixed(0)}%</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingBreakdown;
