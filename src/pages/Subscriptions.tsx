import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, ArrowUpRight } from "lucide-react";

// Mock data - replace with actual data fetching logic
const subscriptions = [
  {
    id: 1,
    name: "Netflix",
    amount: 15.99,
    billingCycle: "Monthly",
    nextBilling: "2024-03-15",
    category: "Entertainment",
    status: "Active",
  },
  {
    id: 2,
    name: "Spotify",
    amount: 9.99,
    billingCycle: "Monthly",
    nextBilling: "2024-03-20",
    category: "Music",
    status: "Active",
  },
  {
    id: 3,
    name: "Adobe Creative Cloud",
    amount: 52.99,
    billingCycle: "Monthly",
    nextBilling: "2024-03-25",
    category: "Software",
    status: "Active",
  },
];

export default function Subscriptions() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Subscriptions</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <span className="text-lg">Total Monthly: ${subscriptions.reduce((acc, sub) => acc + sub.amount, 0).toFixed(2)}</span>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">{subscription.name}</TableCell>
                    <TableCell>${subscription.amount}</TableCell>
                    <TableCell>{subscription.billingCycle}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {new Date(subscription.nextBilling).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{subscription.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {subscription.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                        Manage
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
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