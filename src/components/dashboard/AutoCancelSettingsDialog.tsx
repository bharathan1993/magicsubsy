import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface AutoCancelSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AutoCancelSettingsDialog({ open, onOpenChange }: AutoCancelSettingsDialogProps) {
  const [selectedSubscription, setSelectedSubscription] = useState<string>("");
  const [cancelDate, setCancelDate] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq('user_id', session.user.id)
        .eq('status', 'active');

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const handleSave = async () => {
    if (!selectedSubscription || !cancelDate || !session?.user?.id) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('auto_cancel_settings')
        .upsert({
          user_id: session.user.id,
          subscription_id: selectedSubscription,
          cancel_date: cancelDate,
        }, {
          onConflict: 'user_id,subscription_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Auto-cancel settings have been saved successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ['auto-cancel-settings'] });
      onOpenChange(false);
      setSelectedSubscription("");
      setCancelDate("");
    } catch (error) {
      console.error('Error saving auto-cancel settings:', error);
      toast({
        title: "Error",
        description: "Failed to save auto-cancel settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Auto-Cancel Settings</DialogTitle>
          <DialogDescription>
            Set up automatic cancellation for your subscription.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subscription" className="text-right">
              Subscription
            </Label>
            <Select
              value={selectedSubscription}
              onValueChange={setSelectedSubscription}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a subscription" />
              </SelectTrigger>
              <SelectContent>
                {subscriptions.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name} - {sub.amount}/month
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cancel-date" className="text-right">
              Cancel Date
            </Label>
            <Input
              id="cancel-date"
              type="date"
              value={cancelDate}
              onChange={(e) => setCancelDate(e.target.value)}
              className="col-span-3"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}