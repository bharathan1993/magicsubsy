import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-16 space-y-8">
      <div className="relative inline-block">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text animate-fade-in">
          Manage Your Subscriptions
        </h1>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
      </div>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in delay-100">
        Take control of your digital subscriptions with our all-in-one management platform
      </p>
      <div className="flex justify-center gap-4 animate-fade-in delay-200">
        <Button 
          size="lg" 
          onClick={() => navigate("/app")}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 transform transition-transform duration-200 hover:scale-105"
        >
          Get Started <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}