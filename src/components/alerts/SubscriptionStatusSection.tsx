import { Calendar } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SubscriptionStatusSectionProps {
  trialEnding: boolean;
  autoRenewal: boolean;
  subscriptionExpiry: boolean;
  onToggleChange: (field: string, value: boolean) => void;
}

export const SubscriptionStatusSection = ({
  trialEnding,
  autoRenewal,
  subscriptionExpiry,
  onToggleChange,
}: SubscriptionStatusSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Subscription Status
      </h3>
      <div className="ml-7 space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="trial-ending">Trial period ending</Label>
          <Switch
            id="trial-ending"
            checked={trialEnding}
            onCheckedChange={(checked) => onToggleChange('trial_ending', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-renewal">Auto-renewal reminders</Label>
          <Switch
            id="auto-renewal"
            checked={autoRenewal}
            onCheckedChange={(checked) => onToggleChange('auto_renewal', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="subscription-expiry">Subscription expiry</Label>
          <Switch
            id="subscription-expiry"
            checked={subscriptionExpiry}
            onCheckedChange={(checked) => onToggleChange('subscription_expiry', checked)}
          />
        </div>
      </div>
    </div>
  );
};