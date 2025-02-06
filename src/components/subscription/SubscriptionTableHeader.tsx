import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function SubscriptionTableHeader() {
  return (
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
  );
}