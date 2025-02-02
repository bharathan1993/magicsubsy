import { Badge } from "@/components/ui/badge";
import { AlertPreferencesForm } from "@/components/alerts/AlertPreferencesForm";
import { RecentAlerts } from "@/components/alerts/RecentAlerts";

export default function Alerts() {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Subscription Alerts</h1>
          <Badge variant="secondary" className="ml-2">
            3 New
          </Badge>
        </div>

        {/* Alert Settings Section */}
        <AlertPreferencesForm />

        {/* Recent Alerts Section */}
        <RecentAlerts />
      </div>
    </div>
  );
}