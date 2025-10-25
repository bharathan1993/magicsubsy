import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black opacity-10" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10" />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center text-white"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm mb-6">
            <Mail className="h-8 w-8" />
          </div>
          
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Stay in the Loop
          </h2>
          
          {/* Description */}
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Get the latest tips, updates, and exclusive offers delivered straight to your inbox. No spam, unsubscribe anytime.
          </p>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto sm:max-w-lg">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3 bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <Button
                type="submit"
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors duration-200"
              >
                <span className="flex items-center">
                  Subscribe
                  <Send className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </div>
          </form>
          
          {/* Privacy note */}
          <p className="mt-6 text-sm text-blue-200">
            We respect your privacy. Read our{' '}
            <a href="#" className="underline hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}