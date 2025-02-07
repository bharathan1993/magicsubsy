
import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PhoneVerification } from "./PhoneVerification";

export const TwoFactorAuth = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch2FAStatus = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from("two_factor_auth")
          .select("is_enabled")
          .eq("user_id", session.user.id)
          .single();

        if (error) throw error;
        
        setIs2FAEnabled(data?.is_enabled || false);
      } catch (error) {
        console.error("Error fetching 2FA status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetch2FAStatus();
  }, [session?.user?.id]);

  const handleToggle2FA = async (checked: boolean) => {
    if (checked && !is2FAEnabled) {
      setShowSetup(true);
      return;
    }

    // Disable 2FA
    try {
      const { error } = await supabase
        .from("two_factor_auth")
        .update({ is_enabled: false })
        .eq("user_id", session?.user.id);

      if (error) throw error;

      setIs2FAEnabled(false);
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Two-Factor Authentication (2FA)
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account by requiring a verification code sent to your phone
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">
                Protect your account with SMS-based two-factor authentication
              </p>
            </div>
            <Switch
              checked={is2FAEnabled}
              onCheckedChange={handleToggle2FA}
              disabled={loading}
            />
          </div>

          {showSetup && !is2FAEnabled && (
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Set up Two-Factor Authentication</h3>
              <PhoneVerification />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
