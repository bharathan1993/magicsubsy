import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SignInDialog } from "@/components/auth/SignInDialog";
import { useState } from "react";

export default function Auth() {
  const navigate = useNavigate();
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  const handleSignInSuccess = () => {
    setShowSignInDialog(false);
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
      <Button
        variant="ghost"
        onClick={() => navigate("/landing")}
        className="absolute top-4 left-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>
            Sign in or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-4">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setShowSignInDialog(true)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Continue with Gmail
              </Button>
              <Button className="w-full" variant="outline">
                <Phone className="mr-2 h-4 w-4" />
                Continue with Phone
              </Button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setShowSignInDialog(true)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Sign up with Gmail
              </Button>
              <Button className="w-full" variant="outline">
                <Phone className="mr-2 h-4 w-4" />
                Sign up with Phone
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <SignInDialog
        open={showSignInDialog}
        onOpenChange={setShowSignInDialog}
        onSignInSuccess={handleSignInSuccess}
      />
    </div>
  );
}