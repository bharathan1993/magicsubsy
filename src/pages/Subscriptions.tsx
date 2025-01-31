import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, ArrowUpRight } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billing_cycle: string;
  next_billing_date: string;
  category: string;
  website_url: string | null;
}

export default function Subscriptions() {
  const { formatAmount } = useCurrency();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setSubscriptions(data || []);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        toast({
          title: "Error",
          description: "Failed to load subscriptions. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchSubscriptions();
  }, [toast]);

  const totalMonthly = subscriptions.reduce((acc, sub) => {
    let monthlyAmount = sub.amount;
    // Convert amounts to monthly basis
    if (sub.billing_cycle === "quarterly") monthlyAmount = sub.amount / 3;
    if (sub.billing_cycle === "annual") monthlyAmount = sub.amount / 12;
    return acc + monthlyAmount;
  }, 0);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Subscriptions</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <span className="text-lg">Total Monthly: {formatAmount(totalMonthly)}</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Billing Cycle</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">{subscription.name}</TableCell>
                    <TableCell>{formatAmount(subscription.amount)}</TableCell>
                    <TableCell className="capitalize">{subscription.billing_cycle}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {new Date(subscription.next_billing_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {subscription.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {subscription.website_url && (
                        <a
                          href={subscription.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          Visit Site
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}