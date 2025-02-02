import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpRight } from "lucide-react";

interface SubscriptionActionsProps {
  subscriptionId: string;
  websiteUrl: string | null;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export function SubscriptionActions({ 
  subscriptionId, 
  websiteUrl, 
  onEdit,
  onDelete
}: SubscriptionActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        className="h-8 w-8"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(subscriptionId)}
        className="h-8 w-8 text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {websiteUrl && (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          Visit
          <ArrowUpRight className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}