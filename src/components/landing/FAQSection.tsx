import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

export function FAQSection() {
  const faqs = [
    {
      question: "How does the subscription management work?",
      answer: "Our platform automatically tracks and manages all your digital subscriptions in one place. We provide insights, reminders, and optimization suggestions to help you save money."
    },
    {
      question: "Can I cancel my subscriptions through your platform?",
      answer: "Yes! You can cancel or modify subscriptions directly through our platform, making it easier to manage all your services in one place."
    },
    {
      question: "Is my subscription data secure?",
      answer: "Absolutely. We use bank-level encryption and security measures to protect your data. We never store sensitive payment information."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer a 14-day free trial so you can experience all our premium features before making a decision."
    },
    {
      question: "How much money can I save?",
      answer: "On average, our users save 30% on their subscription costs by identifying unused services and finding better alternatives."
    },
    {
      question: "Which platforms do you support?",
      answer: "We support over 100+ major subscription platforms including Netflix, Spotify, Adobe, Microsoft, and many more."
    }
  ];

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
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Frequently Asked
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Questions
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Got questions? We've got answers. Find everything you need to know about our subscription management platform.
          </p>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <AccordionTrigger className="px-6 py-5 text-left hover:no-underline hover:bg-gray-50 transition-colors duration-200">
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions?
          </p>
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}