import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Check, X, Star, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const services = [
  {
    name: "Netflix",
    price: 15.99,
    rating: 4.5,
    features: [
      "4K Streaming",
      "Multiple Profiles",
      "Downloads",
      "No Ads",
      "Original Content"
    ],
    category: "Streaming",
    highlight: "Most Popular",
    description: "Stream award-winning Netflix originals, movies, TV shows, documentaries, and more."
  },
  {
    name: "Disney+",
    price: 13.99,
    rating: 4.3,
    features: [
      "4K Streaming",
      "Multiple Profiles",
      "Downloads",
      "No Ads",
      "Family Content"
    ],
    category: "Streaming",
    highlight: "Family Favorite",
    description: "Your streaming home for Disney, Pixar, Marvel, Star Wars, and National Geographic."
  }
];

export default function CompareServices() {
  const { toast } = useToast();

  const handleViewDetails = (serviceName: string) => {
    toast({
      title: "Loading details",
      description: `Viewing details for ${serviceName}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Compare Streaming Services
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the perfect streaming service for your entertainment needs. Compare features, prices, and content libraries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <Card key={service.name} className="relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {service.highlight}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="flex flex-col space-y-2">
                  <span className="text-2xl">{service.name}</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{service.rating}</span>
                    </div>
                    <div className="flex items-center text-lg font-bold text-green-600">
                      <DollarSign className="h-4 w-4" />
                      {service.price}
                    </div>
                  </div>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {service.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {service.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full group-hover:bg-primary/90 transition-colors"
                  onClick={() => handleViewDetails(service.name)}
                >
                  <span>View Details</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium text-primary">Feature</div>
              {services.map(service => (
                <div key={service.name} className="font-medium text-center">
                  {service.name}
                </div>
              ))}
              
              {[
                "4K Quality",
                "Offline Downloads",
                "Multiple Profiles",
                "Ad-free Experience",
                "Original Content"
              ].map((feature) => (
                <React.Fragment key={feature}>
                  <div className="text-sm py-2 border-t">{feature}</div>
                  {services.map(service => (
                    <div key={`${service.name}-${feature}`} className="text-center border-t py-2">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}