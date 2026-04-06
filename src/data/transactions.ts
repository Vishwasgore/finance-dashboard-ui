export type TransactionType = "income" | "expense";
export type TransactionStatus = "Processed" | "Pending";
export type TransactionCategory =
  | "Groceries"
  | "Transport"
  | "Dining"
  | "Shopping"
  | "Subscriptions"
  | "Income"
  | "Housing"
  | "Healthcare"
  | "Entertainment"
  | "Utilities";

export interface Transaction {
  id: string;
  date: string; // ISO string: "2024-09-18"
  merchant: string;
  category: TransactionCategory;
  type: TransactionType;
  amount: number; // always positive; sign derived from type
  status: TransactionStatus;
}

export const CATEGORIES: TransactionCategory[] = [
  "Groceries",
  "Transport",
  "Dining",
  "Shopping",
  "Subscriptions",
  "Income",
  "Housing",
  "Healthcare",
  "Entertainment",
  "Utilities",
];

export const initialTransactions: Transaction[] = [
  {
    id: "txn-001",
    date: "2024-09-18",
    merchant: "Whole Foods Market",
    category: "Groceries",
    type: "expense",
    amount: 87.42,
    status: "Processed",
  },
  {
    id: "txn-002",
    date: "2024-09-17",
    merchant: "Transfer from Chase ••••9281",
    category: "Income",
    type: "income",
    amount: 2350.0,
    status: "Processed",
  },
  {
    id: "txn-003",
    date: "2024-09-16",
    merchant: "Netflix",
    category: "Subscriptions",
    type: "expense",
    amount: 15.49,
    status: "Pending",
  },
  {
    id: "txn-004",
    date: "2024-09-15",
    merchant: "Shell Gas Station",
    category: "Transport",
    type: "expense",
    amount: 63.8,
    status: "Processed",
  },
  {
    id: "txn-005",
    date: "2024-09-14",
    merchant: "Urban Outfitters",
    category: "Shopping",
    type: "expense",
    amount: 124.0,
    status: "Processed",
  },
  {
    id: "txn-006",
    date: "2024-09-13",
    merchant: "Freelance Payment – Client A",
    category: "Income",
    type: "income",
    amount: 1800.0,
    status: "Processed",
  },
  {
    id: "txn-007",
    date: "2024-09-12",
    merchant: "Chipotle",
    category: "Dining",
    type: "expense",
    amount: 18.75,
    status: "Processed",
  },
  {
    id: "txn-008",
    date: "2024-09-11",
    merchant: "Landlord – Rent",
    category: "Housing",
    type: "expense",
    amount: 1550.0,
    status: "Processed",
  },
  {
    id: "txn-009",
    date: "2024-09-10",
    merchant: "Spotify",
    category: "Subscriptions",
    type: "expense",
    amount: 9.99,
    status: "Processed",
  },
  {
    id: "txn-010",
    date: "2024-09-09",
    merchant: "CVS Pharmacy",
    category: "Healthcare",
    type: "expense",
    amount: 34.2,
    status: "Processed",
  },
  {
    id: "txn-011",
    date: "2024-09-08",
    merchant: "Uber",
    category: "Transport",
    type: "expense",
    amount: 22.5,
    status: "Processed",
  },
  {
    id: "txn-012",
    date: "2024-09-07",
    merchant: "Salary – Acme Corp",
    category: "Income",
    type: "income",
    amount: 4200.0,
    status: "Processed",
  },
  {
    id: "txn-013",
    date: "2024-09-06",
    merchant: "AMC Theatres",
    category: "Entertainment",
    type: "expense",
    amount: 28.0,
    status: "Processed",
  },
  {
    id: "txn-014",
    date: "2024-09-05",
    merchant: "Con Edison – Electric",
    category: "Utilities",
    type: "expense",
    amount: 91.0,
    status: "Pending",
  },
  {
    id: "txn-015",
    date: "2024-09-04",
    merchant: "Trader Joe's",
    category: "Groceries",
    type: "expense",
    amount: 56.3,
    status: "Processed",
  },
  {
    id: "txn-016",
    date: "2024-09-03",
    merchant: "Apple One",
    category: "Subscriptions",
    type: "expense",
    amount: 21.95,
    status: "Processed",
  },
  {
    id: "txn-017",
    date: "2024-09-02",
    merchant: "Starbucks",
    category: "Dining",
    type: "expense",
    amount: 12.4,
    status: "Processed",
  },
  {
    id: "txn-018",
    date: "2024-09-01",
    merchant: "Amazon",
    category: "Shopping",
    type: "expense",
    amount: 67.99,
    status: "Processed",
  },
  {
    id: "txn-019",
    date: "2024-08-31",
    merchant: "Freelance Payment – Client B",
    category: "Income",
    type: "income",
    amount: 950.0,
    status: "Processed",
  },
  {
    id: "txn-020",
    date: "2024-08-30",
    merchant: "Target",
    category: "Shopping",
    type: "expense",
    amount: 43.15,
    status: "Processed",
  },
];
