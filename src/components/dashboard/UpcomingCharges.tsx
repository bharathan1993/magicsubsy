import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Calendar } from "lucide-react";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  next_billing_date: string;
}

export function UpcomingCharges() {
  const [upcomingCharges, setUpcomingCharges] = useState<Subscription[]>([]);
  const { formatAmount } = useCurrency();

  useEffect(() => {
    const fetchUpcomingCharges = async () => {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const { data, error } = await supabase
        .from("subscriptions")
        .select("id, name, amount, next_billing_date")
        .lte("next_billing_date", thirtyDaysFromNow.toISOString().split('T')[0])
        .gte("next_billing_date", new Date().toISOString().split('T')[0])
        .order("next_billing_date", { ascending: true });

      if (!error && data) {
        setUpcomingCharges(data);
      }
    };

    fetchUpcomingCharges();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Charges</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingCharges.map((charge) => (
            <div
              key={charge.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
            >
              <div className="flex items-center gap-4">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{charge.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(charge.next_billing_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="font-medium">{formatAmount(charge.amount)}</p>
            </div>
          ))}
          {upcomingCharges.length === 0 && (
            <p className="text-center text-muted-foreground">
              No upcoming charges in the next 30 days
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}