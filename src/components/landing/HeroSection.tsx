import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative text-center mb-16 space-y-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-blue-100 opacity-50 -z-10" />
      <div className="relative inline-block">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 text-transparent bg-clip-text animate-fade-in">
          Manage Your Subscriptions
        </h1>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full"></div>
      </div>
      <p className="text-xl text-gray-700 max-w-2xl mx-auto animate-fade-in delay-100">
        Take control of your digital subscriptions with our all-in-one management platform
      </p>
      <div className="flex justify-center gap-4 animate-fade-in delay-200">
        <Button 
          size="lg" 
          onClick={() => navigate("/auth")}
          className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white px-8 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          Get Started <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}