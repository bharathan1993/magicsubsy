
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Common country codes for the dropdown
const COUNTRY_CODES = [
  { value: "+1", label: "United States (+1)" },
  { value: "+44", label: "United Kingdom (+44)" },
  { value: "+91", label: "India (+91)" },
  { value: "+61", label: "Australia (+61)" },
  { value: "+86", label: "China (+86)" },
  // Add more country codes as needed
];

export const PhoneVerification = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].value);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // First, save the phone number and country code
      const { error: saveError } = await supabase
        .from("two_factor_auth")
        .upsert({
          user_id: session?.user.id,
          phone_number: phoneNumber,
          country_code: countryCode,
          is_enabled: false,
        });

      if (saveError) throw saveError;

      // Generate a random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Save the OTP with expiration time (15 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      const { error: otpError } = await supabase
        .from("otp_verification")
        .insert({
          user_id: session?.user.id,
          otp_code: otp,
          expires_at: expiresAt.toISOString(),
        });

      if (otpError) throw otpError;

      // In a real application, you would integrate with an SMS service here
      // For demo purposes, we'll show the OTP in a toast
      toast({
        title: "OTP Sent",
        description: `Your OTP is: ${otp} (Demo Only)`,
      });

      setShowOtpInput(true);
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

  const handleVerifyOTP = async () => {
    if (!otpCode) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Verify OTP
      const { data: otpData, error: otpError } = await supabase
        .from("otp_verification")
        .select("*")
        .eq("user_id", session?.user.id)
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

      // Enable 2FA
      const { error: updateError } = await supabase
        .from("two_factor_auth")
        .update({
          is_enabled: true,
          verified_at: new Date().toISOString(),
        })
        .eq("user_id", session?.user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Two-factor authentication has been enabled",
      });

      // Reset form
      setPhoneNumber("");
      setOtpCode("");
      setShowOtpInput(false);
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
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label>Country Code</Label>
        <Select
          value={countryCode}
          onValueChange={setCountryCode}
          disabled={loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select country code" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_CODES.map((code) => (
              <SelectItem key={code.value} value={code.value}>
                {code.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Phone Number</Label>
        <Input
          type="tel"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={loading}
        />
      </div>

      {!showOtpInput ? (
        <Button onClick={handleSendOTP} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send OTP
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label>Enter OTP</Label>
            <Input
              type="text"
              placeholder="Enter the 6-digit OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              disabled={loading}
              maxLength={6}
            />
          </div>
          <Button onClick={handleVerifyOTP} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify OTP
          </Button>
        </div>
      )}
    </div>
  );
};
