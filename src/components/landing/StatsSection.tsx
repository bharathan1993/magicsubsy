import { TrendingUp, Users, Zap, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { cardVariants, staggerContainerVariants, fadeInUpVariants, bounceVariants } from "@/lib/animations";

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
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900"
            variants={fadeInUpVariants}
          >
            Trusted by Thousands
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-shift bg-300%">
              Worldwide
            </span>
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
            variants={fadeInUpVariants}
          >
            Join the community of smart users who are already saving money and taking control of their subscriptions.
          </motion.p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              whileHover="hover"
              className="relative p-8 bg-white rounded-2xl shadow-md border border-gray-100
                         transition-all duration-300 hover:shadow-xl overflow-hidden group"
            >
              {/* Background gradient on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              
              {/* Icon container */}
              <motion.div
                className={`
                  relative h-14 w-14 bg-gradient-to-br ${stat.color} rounded-xl
                  flex items-center justify-center mb-6 text-white
                  shadow-lg
                `}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: "easeInOut"
                  }}
                >
                  {stat.icon}
                </motion.div>
              </motion.div>
              
              {/* Value with animated counter effect */}
              <motion.div
                className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-2 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {stat.value}
                <motion.div
                  className="absolute -top-2 -right-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  </motion.div>
                </motion.div>
              </motion.div>
              
              {/* Label */}
              <motion.div
                className="relative text-xl font-semibold text-gray-900 mb-1"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                {stat.label}
              </motion.div>
              
              {/* Description */}
              <motion.div
                className="relative text-gray-600"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                {stat.description}
              </motion.div>

              {/* Floating particles */}
              <motion.div
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0, rotate: 0 }}
                whileHover={{ scale: 1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
              </motion.div>
              <motion.div
                className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0, rotate: 0 }}
                whileHover={{ scale: 1, rotate: -360 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="w-2 h-2 bg-indigo-400 rounded-full" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}