import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Calendar } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export const AlertPreferencesForm = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [localPreferences, setLocalPreferences] = useState({
    payment_reminder: true,
    payment_reminder_days: 3,
    trial_ending: true,
    auto_renewal: true,
    subscription_expiry: true,
  });

  const { data: preferences, refetch } = useQuery({
    queryKey: ['alert-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_preferences')
        .select('*')
        .eq('user_id', session?.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const updatePreferences = useMutation({
    mutationFn: async (newPreferences: any) => {
      const { error } = await supabase
        .from('alert_preferences')
        .upsert({
          user_id: session?.user.id,
          ...newPreferences,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Alert settings saved",
        description: "Your notification preferences have been updated.",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!preferences && session?.user.id) {
      const defaultPreferences = {
        payment_reminder: true,
        payment_reminder_days: 3,
        trial_ending: true,
        auto_renewal: true,
        subscription_expiry: true,
        user_id: session.user.id
      };
      updatePreferences.mutate(defaultPreferences);
    }
  }, [preferences, session?.user.id]);

  const handleSaveSettings = () => {
    if (!localPreferences) return;
    updatePreferences.mutate(localPreferences);
  };

  const handleToggleChange = (field: string, value: boolean) => {
    setLocalPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleDaysChange = (days: number) => {
    setLocalPreferences(prev => ({ ...prev, payment_reminder_days: days }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Alert Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Reminders */}
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
                checked={localPreferences.payment_reminder}
                onCheckedChange={(checked) => handleToggleChange('payment_reminder', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label>Remind me before payment</Label>
              <RadioGroup
                value={localPreferences.payment_reminder_days?.toString()}
                onValueChange={(value) => handleDaysChange(parseInt(value))}
                className="flex flex-col space-y-2"
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

        {/* Subscription Status */}
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
                checked={localPreferences.trial_ending}
                onCheckedChange={(checked) => handleToggleChange('trial_ending', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-renewal">Auto-renewal reminders</Label>
              <Switch
                id="auto-renewal"
                checked={localPreferences.auto_renewal}
                onCheckedChange={(checked) => handleToggleChange('auto_renewal', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="subscription-expiry">Subscription expiry</Label>
              <Switch
                id="subscription-expiry"
                checked={localPreferences.subscription_expiry}
                onCheckedChange={(checked) => handleToggleChange('subscription_expiry', checked)}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSaveSettings} className="w-full">
          Save Alert Preferences
        </Button>
      </CardContent>
    </Card>
  );
};