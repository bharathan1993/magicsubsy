import { Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const TwoFactorAuth = () => {
  const { toast } = useToast();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handleToggle2FA = async () => {
    setIs2FAEnabled(!is2FAEnabled);
    toast({
      title: "Coming Soon",
      description: "2FA functionality will be available soon!",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Two-Factor Authentication (2FA)
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Enable 2FA</Label>
            <p className="text-sm text-muted-foreground">
              Protect your account with 2FA authentication.
            </p>
          </div>
          <Switch
            checked={is2FAEnabled}
            onCheckedChange={handleToggle2FA}
          />
        </div>
      </CardContent>
    </Card>
  );
};