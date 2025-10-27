import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SignInDialog } from "@/components/auth/SignInDialog";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { fadeInUpVariants, scaleInVariants, slideUpVariants, containerVariants } from "@/lib/animations";

export function HeroSection() {
  const navigate = useNavigate();
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const { toast } = useToast();

  const handleSignInSuccess = () => {
    setShowSignInDialog(false);
    navigate("/app");
    toast({
      title: "Welcome!",
      description: "Successfully signed in to your account.",
    });
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-indigo-50 opacity-60" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Animated background elements */}
      <motion.div
        className="absolute top-32 left-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Zap className="h-8 w-8 text-blue-200 opacity-30" />
      </motion.div>
      <motion.div
        className="absolute top-48 right-32"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Shield className="h-8 w-8 text-indigo-200 opacity-30" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-32"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <TrendingUp className="h-8 w-8 text-purple-200 opacity-30" />
      </motion.div>
      
      <motion.div
        className="relative max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center px-4 py-1.5 mb-6 text-sm font-medium text-blue-700 bg-blue-100 rounded-full"
          variants={fadeInUpVariants}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
          </motion.div>
          Smart subscription management made simple
        </motion.div>
        
        {/* Main heading */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900"
          variants={slideUpVariants}
        >
          Take Control of Your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-shift bg-300%">
            Digital Subscriptions
          </span>
        </motion.h1>
        
        {/* Description */}
        <motion.p
          className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
          variants={fadeInUpVariants}
        >
          Stop wasting money on forgotten subscriptions. Our intelligent platform helps you track, manage, and optimize all your digital services in one place.
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          variants={fadeInUpVariants}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={() => setShowSignInDialog(true)}
              className="px-8 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200"
            >
              Get Started Free
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.div>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 text-base font-medium text-blue-700 bg-white border border-blue-300 rounded-lg shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Demo
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Social proof */}
        <motion.div
          className="mt-12 flex items-center justify-center space-x-6 text-sm text-gray-500"
          variants={fadeInUpVariants}
        >
          <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
            <div className="flex -space-x-2">
              <motion.div
                className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <span className="ml-3">50K+ happy users</span>
          </motion.div>
          <div className="hidden sm:block h-4 w-px bg-gray-300" />
          <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
            <motion.div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <motion.svg
                  key={i}
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 20 20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </motion.svg>
              ))}
            </motion.div>
            <span className="ml-2">4.9/5 rating</span>
          </motion.div>
        </motion.div>
      </motion.div>

      <SignInDialog
        open={showSignInDialog}
        onOpenChange={setShowSignInDialog}
        onSignInSuccess={handleSignInSuccess}
        defaultTab="signin"
      />
    </section>
  );
}