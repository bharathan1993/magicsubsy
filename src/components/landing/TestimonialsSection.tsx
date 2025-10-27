import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cardVariants, staggerContainerVariants, fadeInUpVariants, scaleInVariants } from "@/lib/animations";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp",
    image: "photo-1581091226825-a6a2a5aee158",
    quote: "This subscription management tool has transformed how we handle our business services. The insights provided are invaluable!",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Startup Founder",
    company: "InnovateLabs",
    image: "photo-1519389950473-47ba0277781c",
    quote: "The budget tracking features have helped us save 30% on our monthly subscriptions. Absolutely recommend it!",
    rating: 5
  },
  {
    name: "Emma Davis",
    role: "Financial Analyst",
    company: "FinanceHub",
    image: "photo-1486312338219-ce68d2c6f44d",
    quote: "Finally, a solution that makes subscription management effortless. The UI is intuitive and the analytics are spot-on.",
    rating: 5
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
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
            Loved by Users
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-shift bg-300%">
              Worldwide
            </span>
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
            variants={fadeInUpVariants}
          >
            Join thousands of satisfied users who have transformed their subscription management experience
          </motion.p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="group"
            >
              <Card className="h-full p-6 bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl relative overflow-hidden">
                {/* Background gradient on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                <CardContent className="p-0 relative">
                  {/* Quote icon */}
                  <motion.div
                    className="absolute top-2 right-2 text-gray-200 opacity-50"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                  >
                    <Quote className="h-8 w-8" />
                  </motion.div>
                  
                  {/* Rating */}
                  <motion.div
                    className="flex mb-4"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.2 + i * 0.1 + index * 0.1,
                          type: "spring",
                          stiffness: 300
                        }}
                      >
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  {/* Quote */}
                  <motion.blockquote
                    className="text-gray-700 mb-6 leading-relaxed relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    "{testimonial.quote}"
                  </motion.blockquote>
                  
                  {/* Author */}
                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Avatar className="h-12 w-12 border-2 border-gray-200 relative">
                        <AvatarImage src={`https://images.unsplash.com/${testimonial.image}`} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        {/* Animated ring */}
                        <motion.div
                          className="absolute -inset-1 rounded-full border-2 border-blue-400"
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </Avatar>
                    </motion.div>
                    <div className="ml-4">
                      <motion.div
                        className="font-semibold text-gray-900"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {testimonial.name}
                      </motion.div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-xs text-gray-500">{testimonial.company}</div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}