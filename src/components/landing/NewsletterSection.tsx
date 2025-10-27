import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Mail, Send, Bell, Sparkles } from "lucide-react";
import { fadeInUpVariants, scaleInVariants } from "@/lib/animations";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thanks for subscribing!",
      description: "We'll keep you updated with the latest news and updates.",
    });
    setEmail("");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black opacity-10" />
      <div className="absolute top-0 left-0 w-full h-full">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10"
          animate={{ scale: [1.5, 1, 1.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-5"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-5"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm mb-6"
            variants={scaleInVariants}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Mail className="h-8 w-8" />
            </motion.div>
          </motion.div>
          
          {/* Heading */}
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            variants={fadeInUpVariants}
          >
            Stay in the Loop
          </motion.h2>
          
          {/* Description */}
          <motion.p
            className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto"
            variants={fadeInUpVariants}
          >
            Get the latest tips, updates, and exclusive offers delivered straight to your inbox. No spam, unsubscribe anytime.
          </motion.p>
          
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto sm:max-w-lg"
            variants={fadeInUpVariants}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.div
                className="flex-1 relative"
                whileFocus={{ scale: 1.02 }}
              >
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-3 bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 pr-12"
                  required
                />
                <motion.div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Bell className="h-4 w-4" />
                </motion.div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors duration-200"
                >
                  <span className="flex items-center">
                    Subscribe
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <Send className="ml-2 h-4 w-4" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>
            </div>
          </motion.form>
          
          {/* Privacy note */}
          <motion.p
            className="mt-6 text-sm text-blue-200"
            variants={fadeInUpVariants}
          >
            We respect your privacy. Read our{' '}
            <motion.a
              href="#"
              className="underline hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Privacy Policy
            </motion.a>
            .
          </motion.p>

          {/* Floating elements */}
          <motion.div
            className="absolute top-10 right-10 opacity-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-6 w-6 text-white" />
          </motion.div>
          <motion.div
            className="absolute bottom-10 left-10 opacity-20"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <Bell className="h-6 w-6 text-white" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}