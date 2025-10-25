import { TrendingUp, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    value: "100+",
    label: "Supported Services",
    description: "All major subscription platforms",
    icon: <Zap className="h-6 w-6" />,
    color: "from-blue-500 to-blue-600"
  },
  {
    value: "30%",
    label: "Average Savings",
    description: "Save money with smart insights",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "from-indigo-500 to-indigo-600"
  },
  {
    value: "50K+",
    label: "Happy Users",
    description: "Join our growing community",
    icon: <Users className="h-6 w-6" />,
    color: "from-purple-500 to-purple-600"
  }
];

export function StatsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Trusted by Thousands
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Worldwide
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Join the community of smart users who are already saving money and taking control of their subscriptions.
          </p>
        </div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="relative p-8 bg-white rounded-2xl shadow-md border border-gray-100
                         transition-all duration-300 hover:shadow-xl"
            >
              {/* Icon */}
              <motion.div
                className={`
                  h-14 w-14 bg-gradient-to-br ${stat.color} rounded-xl
                  flex items-center justify-center mb-6 text-white
                  transition-transform duration-300 hover:scale-110
                `}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {stat.icon}
              </motion.div>
              
              {/* Value */}
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-2">
                {stat.value}
              </div>
              
              {/* Label */}
              <div className="text-xl font-semibold text-gray-900 mb-1">
                {stat.label}
              </div>
              
              {/* Description */}
              <div className="text-gray-600">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}