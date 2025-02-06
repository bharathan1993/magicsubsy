import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Billing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/app')} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Billing & Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Current Plan</h3>
              <p className="text-sm text-muted-foreground">Free Plan</p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Payment Method</h3>
              <p className="text-sm text-muted-foreground">No payment method added</p>
              <Button className="mt-4">Add Payment Method</Button>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Billing History</h3>
              <p className="text-sm text-muted-foreground">No billing history available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}