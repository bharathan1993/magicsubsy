import { Users, Star, Award } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    content: "This platform has revolutionized how we manage our subscriptions. The analytics are incredible!"
  },
  {
    name: "Michael Chen",
    role: "CEO",
    company: "StartupX",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    content: "We've reduced our subscription costs by 40% since using this platform. Absolutely recommend!"
  },
  {
    name: "Emma Williams",
    role: "Finance Director",
    company: "GlobalTech",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    content: "The best subscription management tool we've ever used. Customer support is exceptional!"
  }
];

const trustBadges = [
  { name: "Forbes", icon: Star },
  { name: "TechCrunch", icon: Award },
  { name: "500 Startups", icon: Users }
];

export function SocialProofSection() {
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    // Simulate real-time counter animation
    const target = 15789;
    const duration = 2000;
    const steps = 50;
    const increment = target / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setActiveUsers(target);
        clearInterval(interval);
      } else {
        setActiveUsers(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-violet-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Active Users Counter */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-violet-600 to-blue-600 text-transparent bg-clip-text">
            Trusted by Thousands
          </h2>
          <div className="flex justify-center items-center gap-4">
            <Users className="w-8 h-8 text-violet-600" />
            <span className="text-4xl font-bold text-violet-600">
              {activeUsers.toLocaleString()}+
            </span>
            <span className="text-gray-600">Active Users</span>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="mb-16">
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <Card className="border-violet-100">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-12 w-12 border-2 border-violet-200">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                          <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 italic">{testimonial.content}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <Icon className="w-12 h-12 text-violet-600 mb-4" />
                <span className="text-lg font-semibold text-gray-900">{badge.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}