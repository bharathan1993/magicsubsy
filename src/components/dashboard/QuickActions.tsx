import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, List, X, Settings } from "lucide-react";
import { useState } from "react";
import { NewSubscriptionDialog } from "./NewSubscriptionDialog";

export function QuickActions() {
  const [showNewSubscriptionDialog, setShowNewSubscriptionDialog] = useState(false);

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscriptions with ease
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          className="w-full justify-start" 
          variant="default"
          onClick={() => setShowNewSubscriptionDialog(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Subscription
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <List className="mr-2 h-4 w-4" /> Manage Subscriptions
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <X className="mr-2 h-4 w-4" /> Cancel a Subscription
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Settings className="mr-2 h-4 w-4" /> Auto-Cancel Settings
        </Button>
      </div>

      <NewSubscriptionDialog 
        open={showNewSubscriptionDialog} 
        onOpenChange={setShowNewSubscriptionDialog}
      />
    </Card>
  );
}