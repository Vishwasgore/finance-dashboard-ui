import { useDashboardState } from "@/store/useDashboardState";
import { useDarkMode } from "@/hooks/useDarkMode";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BalanceCard from "@/components/dashboard/BalanceCard";
import StatCards from "@/components/dashboard/StatCards";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import SpendingBreakdown from "@/components/dashboard/SpendingBreakdown";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import TransactionsTable from "@/components/dashboard/TransactionsTable";

const Index = () => {
  const store = useDashboardState();
  const { isDark, toggle: toggleDark } = useDarkMode();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        role={store.role}
        onRoleChange={store.setRole}
        availableMonths={store.availableMonths}
        selectedMonth={store.selectedMonth}
        onMonthChange={store.changeMonth}
        isDark={isDark}
        onToggleDark={toggleDark}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Top row: Balance + Income/Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <BalanceCard
              balance={store.totalBalance}
              income={store.totalIncome}
              expenses={store.totalExpenses}
            />
          </div>
          <StatCards income={store.totalIncome} expenses={store.totalExpenses} />
        </div>

        {/* Middle row: Cash Flow Chart + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <CashFlowChart chartData={store.chartData} isDark={isDark} />
          </div>
          <div className="lg:col-span-2">
            <InsightsPanel insights={store.insights} />
          </div>
        </div>

        {/* Spending Breakdown */}
        <SpendingBreakdown
          transactions={store.monthScopedTransactions}
          isDark={isDark}
        />

        {/* Transactions */}
        <TransactionsTable
          role={store.role}
          transactions={store.filteredTransactions}
          totalCount={store.monthScopedTransactions.length}
          filters={store.filters}
          onFilterChange={store.updateFilters}
          onResetFilters={store.resetFilters}
          onAdd={store.addTransaction}
          onEdit={store.updateTransaction}
          onDelete={store.deleteTransaction}
        />
      </main>
    </div>
  );
};

export default Index;
