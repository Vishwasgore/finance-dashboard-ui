import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, Wallet, Moon, Sun } from "lucide-react";
import { SelectedMonth } from "@/store/useDashboardState";

interface DashboardHeaderProps {
  role: "viewer" | "admin";
  onRoleChange: (role: "viewer" | "admin") => void;
  availableMonths: { value: SelectedMonth; label: string }[];
  selectedMonth: SelectedMonth;
  onMonthChange: (month: SelectedMonth) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

const DashboardHeader = ({
  role,
  onRoleChange,
  availableMonths,
  selectedMonth,
  onMonthChange,
  isDark,
  onToggleDark,
}: DashboardHeaderProps) => {
  const [monthMenuOpen, setMonthMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMonthMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel =
    availableMonths.find((m) => m.value === selectedMonth)?.label ?? "All months";

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
      <div className="flex items-center gap-2">
        <Wallet className="w-5 h-5 text-foreground" />
        <span className="text-lg font-semibold text-foreground">Atlas Finance</span>
      </div>

      <div className="flex items-center gap-5">
        {/* Role toggle */}
        <div className="flex items-center bg-secondary rounded-lg p-0.5 text-sm">
          <button
            onClick={() => onRoleChange("viewer")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              role === "viewer"
                ? "bg-card text-foreground shadow-sm font-medium"
                : "text-muted-foreground"
            }`}
          >
            Viewer
          </button>
          <button
            onClick={() => onRoleChange("admin")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              role === "admin"
                ? "bg-card text-foreground shadow-sm font-medium"
                : "text-muted-foreground"
            }`}
          >
            Admin
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
            VG
          </div>
          <span className="text-sm font-medium text-foreground">Vishwas Gore</span>
          <span className="text-sm text-muted-foreground">• Personal</span>
        </div>

        {/* Dark mode toggle */}
        <button
          id="dark-mode-toggle"
          onClick={onToggleDark}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-foreground" />
          )}
        </button>

        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* Month picker */}
        <div className="relative" ref={menuRef}>
          <button
            id="month-picker-btn"
            onClick={() => setMonthMenuOpen((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            {currentLabel}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-150 ${monthMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {monthMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-36 bg-card border border-border rounded-xl shadow-md z-50 overflow-hidden">
              {availableMonths.map((m) => (
                <button
                  key={m.value}
                  onClick={() => {
                    onMonthChange(m.value);
                    setMonthMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-secondary ${
                    selectedMonth === m.value
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
