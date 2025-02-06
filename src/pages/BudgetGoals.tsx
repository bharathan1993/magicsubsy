import { BudgetGoals } from "@/components/dashboard/BudgetGoals";

export default function BudgetGoalsPage() {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold">Budget Goals & Challenges</h1>
        </div>
        <BudgetGoals />
      </div>
    </div>
  );
}