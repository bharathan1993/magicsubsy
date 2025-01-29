import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    image: "photo-1581091226825-a6a2a5aee158",
    quote: "This subscription management tool has transformed how we handle our business services. The insights provided are invaluable!"
  },
  {
    name: "Michael Chen",
    role: "Startup Founder",
    image: "photo-1519389950473-47ba0277781c",
    quote: "The budget tracking features have helped us save 30% on our monthly subscriptions. Absolutely recommend it!"
  },
  {
    name: "Emma Davis",
    role: "Financial Analyst",
    image: "photo-1486312338219-ce68d2c6f44d",
    quote: "Finally, a solution that makes subscription management effortless. The UI is intuitive and the analytics are spot-on."
  }
];

export function TestimonialsSection() {
  return (
    <div className="py-24 bg-gradient-to-br from-violet-50 to-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-violet-600 to-blue-600 text-transparent bg-clip-text">
          What Our Users Say
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Join thousands of satisfied users who have transformed their subscription management experience
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-violet-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 border-2 border-violet-200">
                    <AvatarImage src={`https://images.unsplash.com/${testimonial.image}`} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}