import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionFormFields } from "../subscription/SubscriptionFormFields";
import { calculateNextBillingDate } from "@/utils/subscriptionUtils";

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
          <SubscriptionFormFields
            name={name}
            setName={setName}
            url={url}
            setUrl={setUrl}
            amount={amount}
            setAmount={setAmount}
            billingCycle={billingCycle}
            setBillingCycle={setBillingCycle}
            category={category}
            setCategory={setCategory}
            activationDate={activationDate}
            setActivationDate={setActivationDate}
            subscriptionType={subscriptionType}
            setSubscriptionType={setSubscriptionType}
          />
          <DialogFooter>
            <Button type="submit">Update Subscription</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}