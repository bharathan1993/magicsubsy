import { CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentRemindersSectionProps {
  paymentReminder: boolean;
  paymentReminderDays: number;
  onToggleChange: (field: string, value: boolean) => void;
  onDaysChange: (days: number) => void;
}

export const PaymentRemindersSection = ({
  paymentReminder,
  paymentReminderDays,
  onToggleChange,
  onDaysChange,
}: PaymentRemindersSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        Payment Reminders
      </h3>
      <div className="ml-7 space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="payment-reminder">Upcoming payment notifications</Label>
          <Switch
            id="payment-reminder"
            checked={paymentReminder}
            onCheckedChange={(checked) => onToggleChange('payment_reminder', checked)}
          />
        </div>
        <div className={`space-y-2 ${!paymentReminder ? 'opacity-50 pointer-events-none' : ''}`}>
          <Label>Remind me before payment</Label>
          <RadioGroup
            value={paymentReminderDays?.toString()}
            onValueChange={(value) => onDaysChange(parseInt(value))}
            className="flex flex-col space-y-2"
            disabled={!paymentReminder}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="7" id="r1" />
              <Label htmlFor="r1">7 days before</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="r2" />
              <Label htmlFor="r2">3 days before</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="r3" />
              <Label htmlFor="r3">1 day before</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};