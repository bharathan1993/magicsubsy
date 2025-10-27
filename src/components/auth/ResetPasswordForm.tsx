import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Update password in Supabase Auth
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      // Update password in User Accounts table as well
      if (data.user) {
        const { error: dbError } = await supabase
          .from('User Accounts')
          .update({ Password: newPassword })
          .eq('user_id', data.user.id);

        if (dbError) {
          console.error('Error updating User Accounts table:', dbError);
          // Don't throw error here as the main password update succeeded
        }
      }

      setResetComplete(true);
      toast({
        title: "Password Reset Successful!",
        description: "Your password has been updated successfully.",
      });

      // Redirect to app after 2 seconds
      setTimeout(() => {
        navigate("/app");
      }, 2000);
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (resetComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <Card className="w-full max-w-md border-2 border-green-100 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full shadow-lg">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Password Reset Complete!
            </CardTitle>
            <CardDescription className="text-base">
              Your password has been successfully updated. Redirecting to dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md border-2 border-blue-100 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30">
        <CardHeader className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex justify-center"
          >
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-full shadow-lg">
              <Lock className="h-12 w-12 text-white" />
            </div>
          </motion.div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-base">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-500" />
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Must be at least 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-500" />
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Reset Password
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
