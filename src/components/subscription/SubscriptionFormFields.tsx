import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubscriptionFormFieldsProps {
  name: string;
  setName: (value: string) => void;
  url: string;
  setUrl: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  billingCycle: string;
  setBillingCycle: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  activationDate: string;
  setActivationDate: (value: string) => void;
  subscriptionType: string;
  setSubscriptionType: (value: string) => void;
}

export function SubscriptionFormFields({
  name,
  setName,
  url,
  setUrl,
  amount,
  setAmount,
  billingCycle,
  setBillingCycle,
  category,
  setCategory,
  activationDate,
  setActivationDate,
  subscriptionType,
  setSubscriptionType,
}: SubscriptionFormFieldsProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="col-span-3"
          placeholder="Netflix, Spotify, etc."
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="url" className="text-right">
          Website URL
        </Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="col-span-3"
          placeholder="https://example.com"
          type="url"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="amount" className="text-right">
          Amount
        </Label>
        <Input
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="col-span-3"
          type="number"
          min="0"
          step="0.01"
          placeholder="9.99"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="activation-date" className="text-right">
          Activation Date
        </Label>
        <Input
          id="activation-date"
          value={activationDate}
          onChange={(e) => setActivationDate(e.target.value)}
          className="col-span-3"
          type="date"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="billing-cycle" className="text-right">
          Billing Cycle
        </Label>
        <Select value={billingCycle} onValueChange={setBillingCycle}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select billing cycle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="annual">Annual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="productivity">Productivity</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="health">Health & Fitness</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="subscription-type" className="text-right">
          Type
        </Label>
        <Select value={subscriptionType} onValueChange={setSubscriptionType}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select subscription type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}