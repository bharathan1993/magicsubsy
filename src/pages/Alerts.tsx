import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, CheckCircle2, DollarSign, Calendar, Percent, CreditCard, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Sample alerts data
const alerts = [
  {
    id: 1,
    title: "Netflix Subscription Due",
    description: "Your Netflix subscription will renew in 3 days",
    type: "warning",
    date: "2024-03-15",
  },
  {
    id: 2,
    title: "Spotify Payment Success",
    description: "Monthly payment processed successfully",
    type: "success",
    date: "2024-03-12",
  },
  {
    id: 3,
    title: "Adobe CC Price Change",
    description: "Subscription price will increase next month",
    type: "alert",
    date: "2024-03-10",
  },
];

export default function Alerts() {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Alert settings saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Subscription Alerts</h1>
          <Badge variant="secondary" className="ml-2">
            {alerts.length} New
          </Badge>
        </div>

        {/* Alert Settings Section */}
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
                  <Switch id="payment-reminder" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Remind me before payment</Label>
                  <RadioGroup defaultValue="3" className="flex flex-col space-y-2">
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

            {/* Price Change Alerts */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ArrowUp className="h-5 w-5" />
                Price Change Alerts
              </h3>
              <div className="ml-7 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="price-changes">Notify about price changes</Label>
                  <Switch id="price-changes" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="price-threshold">Alert when increase is above</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="price-threshold"
                      type="number"
                      className="w-24"
                      defaultValue="10"
                    />
                    <span>%</span>
                  </div>
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
                  <Switch id="trial-ending" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-renewal">Auto-renewal reminders</Label>
                  <Switch id="auto-renewal" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="subscription-expiry">Subscription expiry</Label>
                  <Switch id="subscription-expiry" defaultChecked />
                </div>
              </div>
            </div>

            {/* Deals and Promotions */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Deals & Promotions
              </h3>
              <div className="ml-7 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="special-offers">Special offers</Label>
                  <Switch id="special-offers" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="price-drops">Price drops</Label>
                  <Switch id="price-drops" defaultChecked />
                </div>
              </div>
            </div>

            <Button onClick={handleSaveSettings} className="w-full">
              Save Alert Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Existing Alerts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {alerts.map((alert) => (
                <Card key={alert.id}>
                  <CardContent className="flex items-start gap-4 p-6">
                    {alert.type === "warning" && (
                      <Bell className="h-5 w-5 text-yellow-500" />
                    )}
                    {alert.type === "success" && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {alert.type === "alert" && (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <p className="text-sm text-gray-500">{alert.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{alert.date}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
