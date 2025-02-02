import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Pencil, Trash2, ArrowUpRight, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billing_cycle: string;
  next_billing_date: string;
  category: string;
  website_url: string | null;
  activation_date: string;
  subscription_type: string;
  status: string;
}

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  selectedCategory: string;
}

export function SubscriptionTable({ 
  subscriptions, 
  onEdit, 
  onDelete,
  searchQuery,
  selectedCategory 
}: SubscriptionTableProps) {
  const { formatAmount } = useCurrency();

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || subscription.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Billing Cycle</TableHead>
          <TableHead>Next Billing</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredSubscriptions.map((subscription) => (
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
              <Badge variant="outline" className="capitalize">
                {subscription.subscription_type}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {subscription.status === 'Active' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <Badge 
                  variant={subscription.status === 'Active' ? "secondary" : "destructive"}
                  className={subscription.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                >
                  {subscription.status}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(subscription)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(subscription.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {subscription.website_url && (
                  <a
                    href={subscription.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Visit
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}