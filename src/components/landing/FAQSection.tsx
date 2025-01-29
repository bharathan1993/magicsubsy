import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-violet-600 to-blue-600 text-transparent bg-clip-text">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <AccordionTrigger className="px-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}