import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { CelebrationPopup } from "./CelebrationPopup";
import { useNavigate } from "react-router-dom";

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignInSuccess: () => void;
  defaultTab?: "signin" | "signup";
}

export function SignInDialog({ 
  open, 
  onOpenChange, 
  onSignInSuccess,
  defaultTab = "signin" 
}: SignInDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Then check if user has 2FA enabled
      const { data: twoFactorData, error: twoFactorError } = await supabase
        .from("two_factor_auth")
        .select("is_enabled")
        .eq("user_id", authData.user.id)
        .single();

      if (twoFactorError && !twoFactorError.message.includes("No rows found")) {
        throw twoFactorError;
      }

      // If 2FA is enabled, redirect to verification page
      if (twoFactorData?.is_enabled) {
        navigate('/two-factor-verification', { state: { from: window.location.pathname } });
        return;
      }

      // Get device and browser info
      const userAgent = navigator.userAgent;
      const deviceInfo = {
        browser: getBrowserInfo(userAgent),
        device: /Mobile|Android|iPhone/i.test(userAgent) ? 'Mobile' : 
                /iPad|Tablet/i.test(userAgent) ? 'Tablet' : 'Desktop',
        os: getOSInfo(userAgent)
      };

      // Get IP address
      const ipAddress = await getIpAddress();
      
      // Record login history
      const { error: loginError } = await supabase
        .from('login_history')
        .insert({
          user_id: authData.user.id,
          login_timestamp: new Date().toISOString(),
          device_info: JSON.stringify(deviceInfo),
          ip_address: ipAddress
        });

      if (loginError) {
        console.error('Error recording login history:', loginError);
      }

      // Check if user exists in User Accounts table
      const { data: userData, error: dbError } = await supabase
        .from('User Accounts')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (dbError) {
        throw new Error("User account not found. Please sign up first.");
      }

      onSignInSuccess();
      toast({
        title: "Success",
        description: "Successfully signed in!",
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Check if user already exists first
      const { data: existingUser } = await supabase
        .from('User Accounts')
        .select('user_id')
        .eq('User Name', email)
        .single();

      if (existingUser) {
        toast({
          title: "Error",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
        return;
      }

      // Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          toast({
            title: "Error",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
          return;
        }
        throw authError;
      }

      if (authData.user) {
        const { error: dbError } = await supabase
          .from('User Accounts')
          .insert([
            {
              user_id: authData.user.id,
              "User Name": email,
              Password: password
            }
          ]);

        if (dbError) throw dbError;
        
        // Show celebration popup
        setShowCelebration(true);
      }
      
      // Clear the form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get IP address
  const getIpAddress = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting IP address:', error);
      return 'Unknown';
    }
  };

  // Helper function to get browser info
  const getBrowserInfo = (userAgent: string): string => {
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown Browser';
  };

  // Helper function to get OS info
  const getOSInfo = (userAgent: string): string => {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    return 'Unknown OS';
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome</DialogTitle>
            <DialogDescription>
              {defaultTab === "signin" ? "Sign in to your account" : "Create a new account"}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <CelebrationPopup 
        open={showCelebration} 
        onOpenChange={(open) => {
          setShowCelebration(open);
          if (!open) {
            onSignInSuccess();
          }
        }} 
      />
    </>
  );
}
