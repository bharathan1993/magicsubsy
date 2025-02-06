import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SubscriptionFormFields } from "../subscription/SubscriptionFormFields";
import { calculateNextBillingDate } from "@/utils/subscriptionUtils";

interface NewSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewSubscriptionDialog({ open, onOpenChange }: NewSubscriptionDialogProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [category, setCategory] = useState("entertainment");
  const [activationDate, setActivationDate] = useState(new Date().toISOString().split('T')[0]);
  const [subscriptionType, setSubscriptionType] = useState("online");
  const { toast } = useToast();
  const { session } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add a subscription.",
        variant: "destructive",
      });
      return;
    }

    try {
      const nextBillingDate = calculateNextBillingDate(activationDate, billingCycle);
      
      const { error } = await supabase.from("subscriptions").insert({
        user_id: session.user.id,
        name,
        amount: parseFloat(amount),
        billing_cycle: billingCycle,
        category,
        website_url: url || null,
        activation_date: activationDate,
        next_billing_date: nextBillingDate.toISOString().split('T')[0],
        subscription_type: subscriptionType,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your new subscription has been successfully added.",
      });
      
      onOpenChange(false);
      // Reset form
      setName("");
      setUrl("");
      setAmount("");
      setBillingCycle("monthly");
      setCategory("entertainment");
      setActivationDate(new Date().toISOString().split('T')[0]);
      setSubscriptionType("online");
    } catch (error) {
      console.error("Error adding subscription:", error);
      toast({
        title: "Error",
        description: "Failed to add subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
          <DialogDescription>
            Enter the details of your subscription below.
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
            <Button type="submit">Add Subscription</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}