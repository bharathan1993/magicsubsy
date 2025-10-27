import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, BookOpen, HeadphonesIcon } from "lucide-react";
import { fadeInUpVariants, staggerContainerVariants, scaleInVariants } from "@/lib/animations";

export function FAQSection() {
  const faqs = [
    {
      question: "How does the subscription management work?",
      answer: "Our platform automatically tracks and manages all your digital subscriptions in one place. We provide insights, reminders, and optimization suggestions to help you save money.",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      question: "Can I cancel my subscriptions through your platform?",
      answer: "Yes! You can cancel or modify subscriptions directly through our platform, making it easier to manage all your services in one place.",
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      question: "Is my subscription data secure?",
      answer: "Absolutely. We use bank-level encryption and security measures to protect your data. We never store sensitive payment information.",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer a 14-day free trial so you can experience all our premium features before making a decision.",
      icon: <HeadphonesIcon className="h-5 w-5" />
    },
    {
      question: "How much money can I save?",
      answer: "On average, our users save 30% on their subscription costs by identifying unused services and finding better alternatives.",
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      question: "Which platforms do you support?",
      answer: "We support over 100+ major subscription platforms including Netflix, Spotify, Adobe, Microsoft, and many more.",
      icon: <BookOpen className="h-5 w-5" />
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-48 h-48 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ scale: [1.3, 1, 1.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"
            variants={scaleInVariants}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </motion.div>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4"
            variants={fadeInUpVariants}
          >
            Frequently Asked
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-shift bg-300%">
              Questions
            </span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            variants={fadeInUpVariants}
          >
            Got questions? We've got answers. Find everything you need to know about our subscription management platform.
          </motion.p>
        </motion.div>
        
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md group"
                >
                  <AccordionTrigger className="px-6 py-5 text-left hover:no-underline hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {faq.icon}
                      </motion.div>
                      <span className="font-semibold text-gray-900">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-gray-600 leading-relaxed">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {faq.answer}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
        
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-gray-600 mb-4">
            Still have questions?
          </p>
          <motion.button
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}