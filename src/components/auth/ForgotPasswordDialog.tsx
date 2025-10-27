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
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, KeyRound, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Email Sent!",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setEmailSent(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] border-2 border-blue-100/50 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-4 right-4 text-blue-200"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <KeyRound className="h-6 w-6" />
        </motion.div>

        <DialogHeader className="relative">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex justify-center mb-2"
          >
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full shadow-lg">
              <KeyRound className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {emailSent ? "Check Your Email" : "Forgot Password?"}
            </DialogTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <DialogDescription className="text-center text-base">
              {emailSent
                ? "We've sent a password reset link to your email address."
                : "Enter your email address and we'll send you a link to reset your password."}
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        {!emailSent ? (
          <motion.form
            onSubmit={handleResetPassword}
            className="space-y-5 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                Email Address
              </Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                required
              />
            </div>

            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="w-full border-blue-200 hover:bg-blue-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Link
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.form>
        ) : (
          <motion.div
            className="space-y-5 pt-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-sm text-green-800">
                A password reset link has been sent to <strong>{email}</strong>
              </p>
              <p className="text-xs text-green-600 mt-2">
                The link will expire in 1 hour. Please check your spam folder if you don't see it.
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Done
              </Button>
            </motion.div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
