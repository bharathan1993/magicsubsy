import { CreditCard, Store, PieChart, Bell, Target, Users, ArrowLeftRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Smart Subscription Tracking",
    description: "Track all your subscriptions with AI-powered insights and recommendations",
    details: "Get detailed analytics, spending forecasts, and smart recommendations to optimize your subscription costs.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <Store className="h-6 w-6" />,
    title: "Premium Service Directory",
    description: "Access our curated marketplace of premium subscription services",
    details: "Browse verified providers, exclusive deals, and detailed service comparisons to make informed decisions.",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    icon: <PieChart className="h-6 w-6" />,
    title: "Advanced Analytics Dashboard",
    description: "Visualize your subscription data with interactive charts",
    details: "Track spending patterns, usage metrics, and ROI with customizable dashboards and real-time updates.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Personalized Recommendations",
    description: "Get AI-powered suggestions based on your usage patterns",
    details: "Receive tailored recommendations for cost optimization, new services, and bundle opportunities.",
    color: "from-pink-500 to-pink-600"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Family Plan Management",
    description: "Efficiently manage shared subscriptions and family plans",
    details: "Split costs, track usage, and manage access for family members and groups with ease.",
    color: "from-rose-500 to-rose-600"
  },
  {
    icon: <ArrowLeftRight className="h-6 w-6" />,
    title: "Automated Price Monitoring",
    description: "Stay informed about price changes and better deals",
    details: "Get instant alerts for price changes, promotional offers, and better alternatives in the market.",
    color: "from-amber-500 to-amber-600"
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
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Powerful Features to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Simplify Your Life
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage, track, and optimize your subscriptions in one intelligent platform.
          </p>
        </div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`
                group relative p-8 bg-white rounded-2xl shadow-md border border-gray-100
                transition-all duration-300 cursor-pointer hover:shadow-xl
                ${expandedIndex === index ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
              `}
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              {/* Icon */}
              <motion.div
                className={`
                  h-14 w-14 bg-gradient-to-br ${feature.color} rounded-xl
                  flex items-center justify-center mb-6 text-white
                  transition-transform duration-300 group-hover:scale-110
                `}
              >
                {feature.icon}
              </motion.div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600
                             transition-colors duration-300">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              
              {/* Expanded details */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: expandedIndex === index ? "auto" : 0,
                  opacity: expandedIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {feature.details}
                  </p>
                </div>
              </motion.div>

              {/* Learn more indicator */}
              <div className="flex items-center mt-4 text-blue-600 text-sm font-medium">
                {expandedIndex === index ? "Show less" : "Learn more"}
                <motion.div
                  animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}