import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SignInDialog } from "@/components/auth/SignInDialog";
import { useToast } from "@/components/ui/use-toast";

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
      
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-1.5 mb-6 text-sm font-medium text-blue-700 bg-blue-100 rounded-full animate-fade-in">
          <Sparkles className="w-4 h-4 mr-2" />
          Smart subscription management made simple
        </div>
        
        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 animate-slide-up">
          Take Control of Your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Digital Subscriptions
          </span>
        </h1>
        
        {/* Description */}
        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up-delay-100">
          Stop wasting money on forgotten subscriptions. Our intelligent platform helps you track, manage, and optimize all your digital services in one place.
        </p>
        
        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-delay-200">
          <Button
            size="lg"
            onClick={() => setShowSignInDialog(true)}
            className="px-8 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 text-base font-medium text-blue-700 bg-white border border-blue-300 rounded-lg shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Demo
          </Button>
        </div>
        
        {/* Social proof */}
        <div className="mt-12 flex items-center justify-center space-x-6 text-sm text-gray-500 animate-fade-in-delay-300">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white" />
              <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white" />
              <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white" />
            </div>
            <span className="ml-3">50K+ happy users</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-gray-300" />
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="ml-2">4.9/5 rating</span>
          </div>
        </div>
      </div>

      <SignInDialog
        open={showSignInDialog}
        onOpenChange={setShowSignInDialog}
        onSignInSuccess={handleSignInSuccess}
        defaultTab="signin"
      />
    </section>
  );
}