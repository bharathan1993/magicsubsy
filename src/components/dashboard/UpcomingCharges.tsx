import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Charge {
  service: string;
  date: string;
  amount: number;
}

const charges: Charge[] = [
  { service: "Netflix", date: "May 26, 2023", amount: 14.99 },
  { service: "Spotify", date: "May 28, 2023", amount: 9.99 },
  { service: "Adobe Creative Cloud", date: "June 1, 2023", amount: 52.99 },
  { service: "Gym Membership", date: "June 5, 2023", amount: 45.00 },
];

export function UpcomingCharges() {
  const { formatAmount } = useCurrency();

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Upcoming Charges</h3>
          <p className="text-sm text-muted-foreground">Next 30 days</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {charges.map((charge) => (
          <div
            key={charge.service}
            className="flex items-center justify-between py-2"
          >
            <div>
              <p className="font-medium">{charge.service}</p>
              <p className="text-sm text-muted-foreground">{charge.date}</p>
            </div>
            <span className="font-semibold">{formatAmount(charge.amount)}</span>
          </div>
        ))}
      </div>
      
      <Button variant="outline" className="w-full mt-6">
        <Bell className="w-4 h-4 mr-2" />
        Set Reminders
      </Button>
    </Card>
  );
}