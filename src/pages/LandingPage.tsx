import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              EasyCancely
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              Take control of your subscriptions. Track, manage, and optimize your recurring expenses in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto mt-12">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-purple-600 text-lg font-semibold mb-2">Track Expenses</div>
              <p className="text-gray-600">Monitor all your subscriptions in one dashboard</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-purple-600 text-lg font-semibold mb-2">Smart Insights</div>
              <p className="text-gray-600">Get detailed analytics and spending patterns</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-purple-600 text-lg font-semibold mb-2">Save Money</div>
              <p className="text-gray-600">Identify unused subscriptions and reduce costs</p>
            </div>
          </div>

          <div className="mt-12 animate-bounce-slow">
            <Button
              onClick={() => navigate("/")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-2" />
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-gray-900 mb-4">1000+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-gray-900 mb-4">$50K+</div>
              <div className="text-gray-600">Saved for our users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}