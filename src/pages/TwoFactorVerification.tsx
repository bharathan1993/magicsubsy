
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function TwoFactorVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch user's phone number
      const { data: twoFactorData } = await supabase
        .from("two_factor_auth")
        .select("phone_number, country_code")
        .eq("user_id", session.user.id)
        .single();

      if (twoFactorData) {
        setPhoneNumber(`${twoFactorData.country_code} ${twoFactorData.phone_number}`);
      }

      // Generate and send new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      await supabase
        .from("otp_verification")
        .insert({
          user_id: session.user.id,
          otp_code: otp,
          expires_at: expiresAt.toISOString(),
        });

      // In a real application, you would send the OTP via SMS here
      // For demo purposes, we'll show it in a toast
      toast({
        title: "OTP Sent",
        description: `Your OTP is: ${otp} (Demo Only)`,
      });
    };

    checkSession();
  }, [navigate, toast]);

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      // Verify OTP
      const { data: otpData, error: otpError } = await supabase
        .from("otp_verification")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("otp_code", otpCode)
        .gt("expires_at", new Date().toISOString())
        .is("verified", false)
        .single();

      if (otpError || !otpData) {
        throw new Error("Invalid or expired OTP");
      }

      // Mark OTP as verified
      await supabase
        .from("otp_verification")
        .update({ verified: true })
        .eq("id", otpData.id);

      // Redirect to the intended page or dashboard
      const intendedPath = location.state?.from || "/app";
      navigate(intendedPath);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-2xl font-bold text-center">Two-Factor Authentication</h2>
          <p className="mt-2 text-center text-gray-600">
            Enter the verification code sent to {phoneNumber}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="mt-1"
            />
          </div>

          <Button
            className="w-full"
            onClick={handleVerifyOTP}
            disabled={loading || otpCode.length !== 6}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
}
