import { CreditCard, Store, PieChart, Bell, Target, Users, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <CreditCard className="h-6 w-6 text-violet-600" />,
    title: "Smart Subscription Tracking",
    description: "Track all your subscriptions with AI-powered insights and recommendations",
    details: "Get detailed analytics, spending forecasts, and smart recommendations to optimize your subscription costs."
  },
  {
    icon: <Store className="h-6 w-6 text-blue-600" />,
    title: "Premium Service Directory",
    description: "Access our curated marketplace of premium subscription services",
    details: "Browse verified providers, exclusive deals, and detailed service comparisons to make informed decisions."
  },
  {
    icon: <PieChart className="h-6 w-6 text-violet-600" />,
    title: "Advanced Analytics Dashboard",
    description: "Visualize your subscription data with interactive charts",
    details: "Track spending patterns, usage metrics, and ROI with customizable dashboards and real-time updates."
  },
  {
    icon: <Target className="h-6 w-6 text-blue-600" />,
    title: "Personalized Recommendations",
    description: "Get AI-powered suggestions based on your usage patterns",
    details: "Receive tailored recommendations for cost optimization, new services, and bundle opportunities."
  },
  {
    icon: <Users className="h-6 w-6 text-violet-600" />,
    title: "Family Plan Management",
    description: "Efficiently manage shared subscriptions and family plans",
    details: "Split costs, track usage, and manage access for family members and groups with ease."
  },
  {
    icon: <ArrowLeftRight className="h-6 w-6 text-blue-600" />,
    title: "Automated Price Monitoring",
    description: "Stay informed about price changes and better deals",
    details: "Get instant alerts for price changes, promotional offers, and better alternatives in the market."
  }
];

export function FeaturesGrid() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className={`
            group relative p-8 bg-white rounded-2xl shadow-lg 
            transition-all duration-300 cursor-pointer
            hover:shadow-xl border border-violet-100
            ${expandedIndex === index ? 'md:col-span-2 lg:col-span-1' : ''}
          `}
          onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
        >
          <motion.div 
            className="h-12 w-12 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl 
                       flex items-center justify-center mb-6"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {feature.icon}
          </motion.div>
          
          <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-violet-600 
                         transition-colors duration-300">
            {feature.title}
          </h3>
          
          <motion.div
            initial={{ height: "auto" }}
            animate={{ height: expandedIndex === index ? "auto" : "auto" }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-600 mb-4">{feature.description}</p>
            
            {expandedIndex === index && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 bg-violet-50 rounded-lg text-sm text-gray-700"
              >
                {feature.details}
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="absolute bottom-4 right-4 text-violet-600 text-sm"
            animate={{ opacity: expandedIndex === index ? 0 : 1 }}
          >
            Click to learn more
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}