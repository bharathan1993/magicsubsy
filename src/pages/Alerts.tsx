import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const alerts = [
  {
    id: 1,
    title: "Netflix Subscription Due",
    description: "Your Netflix subscription will renew in 3 days",
    type: "warning",
    date: "2024-03-15",
  },
  {
    id: 2,
    title: "Spotify Payment Success",
    description: "Monthly payment processed successfully",
    type: "success",
    date: "2024-03-12",
  },
  {
    id: 3,
    title: "Adobe CC Price Change",
    description: "Subscription price will increase next month",
    type: "alert",
    date: "2024-03-10",
  },
];

export default function Alerts() {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <h1 className="text-2xl font-bold">Subscription Alerts</h1>
          <Badge variant="secondary" className="ml-2">
            {alerts.length} New
          </Badge>
        </div>

        <div className="grid gap-4">
          {alerts.map((alert) => (
            <Card key={alert.id}>
              <CardContent className="flex items-start gap-4 p-6">
                {alert.type === "warning" && (
                  <Bell className="h-5 w-5 text-yellow-500" />
                )}
                {alert.type === "success" && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {alert.type === "alert" && (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{alert.title}</h3>
                  <p className="text-sm text-gray-500">{alert.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}