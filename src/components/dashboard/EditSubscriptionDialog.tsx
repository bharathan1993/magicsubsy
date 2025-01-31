import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billing_cycle: string;
  category: string;
  website_url: string | null;
  activation_date: string;
  next_billing_date: string;
  subscription_type: string;
}

interface EditSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
}

export function EditSubscriptionDialog({ 
  open, 
  onOpenChange,
  subscription 
}: EditSubscriptionDialogProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [category, setCategory] = useState("entertainment");
  const [activationDate, setActivationDate] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("online");
  const { toast } = useToast();

  useEffect(() => {
    if (subscription) {
      setName(subscription.name);
      setUrl(subscription.website_url || "");
      setAmount(subscription.amount.toString());
      setBillingCycle(subscription.billing_cycle);
      setCategory(subscription.category);
      setActivationDate(subscription.activation_date);
      setSubscriptionType(subscription.subscription_type);
    }
  }, [subscription]);

  const calculateNextBillingDate = (activationDate: string, cycle: string) => {
    const date = new Date(activationDate);
    switch (cycle) {
      case "monthly":
        return new Date(date.setMonth(date.getMonth() + 1));
      case "quarterly":
        return new Date(date.setMonth(date.getMonth() + 3));
      case "annual":
        return new Date(date.setFullYear(date.getFullYear() + 1));
      default:
        return new Date(date.setMonth(date.getMonth() + 1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscription?.id) return;

    try {
      const nextBillingDate = calculateNextBillingDate(activationDate, billingCycle);
      
      const { error } = await supabase
        .from("subscriptions")
        .update({
          name,
          amount: parseFloat(amount),
          billing_cycle: billingCycle,
          category,
          website_url: url || null,
          activation_date: activationDate,
          next_billing_date: nextBillingDate.toISOString().split('T')[0],
          subscription_type: subscriptionType,
        })
        .eq('id', subscription.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your subscription has been successfully updated.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!subscription) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>
            Update the details of your subscription below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
              <Select
                value={billingCycle}
                onValueChange={setBillingCycle}
              >
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
              <Select
                value={category}
                onValueChange={setCategory}
              >
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
              <Select
                value={subscriptionType}
                onValueChange={setSubscriptionType}
              >
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
          <DialogFooter>
            <Button type="submit">Update Subscription</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}