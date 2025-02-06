import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SignInDialog } from "@/components/auth/SignInDialog";
import { useState } from "react";

export default function Auth() {
  const navigate = useNavigate();
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const handleSignInSuccess = () => {
    setShowSignInDialog(false);
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
      <Button
        variant="ghost"
        onClick={() => navigate("/landing")}
        className="absolute top-4 left-4 gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Button>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>
            Sign in or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 mb-6">
            <Button 
              variant={mode === "signin" ? "default" : "outline"}
              onClick={() => setMode("signin")}
            >
              Sign In
            </Button>
            <Button
              variant={mode === "signup" ? "default" : "outline"}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </Button>
          </div>
          
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              setMode("signup");
              setShowSignInDialog(true);
            }}
          >
            <Mail className="mr-2 h-4 w-4" />
            Sign up with Gmail
          </Button>
          <Button className="w-full" variant="outline">
            <Phone className="mr-2 h-4 w-4" />
            Sign up with Phone
          </Button>
        </CardContent>
      </Card>

      <SignInDialog
        open={showSignInDialog}
        onOpenChange={setShowSignInDialog}
        onSignInSuccess={handleSignInSuccess}
        defaultTab={mode}
      />
    </div>
  );
}