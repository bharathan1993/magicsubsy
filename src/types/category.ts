export interface CategorySummary {
  name: string;
  percentage: number;
  amount: number;
  trend: "up" | "down" | "stable";
  description: string;
}