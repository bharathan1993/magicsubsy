import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CreditCard, PieChart, Bell, Target, Users, ArrowLeftRight, Store } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Subscription Management",
      description: "Track and manage all your subscriptions in one place"
    },
    {
      icon: <Store className="h-6 w-6" />,
      title: "Subscription Marketplace",
      description: "Discover and compare different subscription services"
    },
    {
      icon: <PieChart className="h-6 w-6" />,
      title: "Spending Insights",
      description: "Visualize and analyze your subscription spending patterns"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Budget Goals",
      description: "Set and track your subscription budget goals"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Subscription Sharing",
      description: "Manage shared subscriptions with family and friends"
    },
    {
      icon: <ArrowLeftRight className="h-6 w-6" />,
      title: "Service Comparison",
      description: "Compare different subscription services side by side"
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Smart Alerts",
      description: "Get notified about upcoming payments and price changes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
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
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 transform transition-transform duration-200 hover:scale-105"
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-32 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-100 animate-fade-in">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">100+</div>
              <div className="text-gray-600 mt-2">Supported Services</div>
            </div>
            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-100 animate-fade-in delay-100">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">30%</div>
              <div className="text-gray-600 mt-2">Average Savings</div>
            </div>
            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-100 animate-fade-in delay-200">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">50K+</div>
              <div className="text-gray-600 mt-2">Happy Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}