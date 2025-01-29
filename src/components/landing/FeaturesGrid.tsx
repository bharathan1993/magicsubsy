import { CreditCard, Store, PieChart, Bell, Target, Users, ArrowLeftRight } from "lucide-react";

const features = [
  {
    icon: <CreditCard className="h-6 w-6 text-violet-600" />,
    title: "Subscription Management",
    description: "Track and manage all your subscriptions in one place"
  },
  {
    icon: <Store className="h-6 w-6 text-blue-600" />,
    title: "Subscription Marketplace",
    description: "Discover and compare different subscription services"
  },
  {
    icon: <PieChart className="h-6 w-6 text-violet-600" />,
    title: "Spending Insights",
    description: "Visualize and analyze your subscription spending patterns"
  },
  {
    icon: <Target className="h-6 w-6 text-blue-600" />,
    title: "Budget Goals",
    description: "Set and track your subscription budget goals"
  },
  {
    icon: <Users className="h-6 w-6 text-violet-600" />,
    title: "Subscription Sharing",
    description: "Manage shared subscriptions with family and friends"
  },
  {
    icon: <ArrowLeftRight className="h-6 w-6 text-blue-600" />,
    title: "Service Comparison",
    description: "Compare different subscription services side by side"
  },
  {
    icon: <Bell className="h-6 w-6 text-violet-600" />,
    title: "Smart Alerts",
    description: "Get notified about upcoming payments and price changes"
  }
];

export function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24">
      {features.map((feature, index) => (
        <div 
          key={feature.title}
          className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-violet-100 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="h-12 w-12 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            {feature.icon}
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}