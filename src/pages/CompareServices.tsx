import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Check, X, Star, ArrowRight, Filter, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Service {
  id: string;
  name: string;
  price: number;
  rating: number;
  features: string[];
  category: string;
  highlight: string;
  description: string;
}

const allServices: Service[] = [
  {
    id: "netflix",
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
    id: "disney",
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
  },
  {
    id: "spotify",
    name: "Spotify Premium",
    price: 9.99,
    rating: 4.7,
    features: [
      "Ad-free Music",
      "Offline Listening",
      "High Quality Audio",
      "Unlimited Skips",
      "Personalized Playlists"
    ],
    category: "Music",
    highlight: "Best Audio Quality",
    description: "Stream and download millions of songs and podcasts with no ads and unlimited skips."
  },
  {
    id: "apple-music",
    name: "Apple Music",
    price: 10.99,
    rating: 4.5,
    features: [
      "Ad-free Music",
      "Offline Listening",
      "Lossless Audio",
      "Spatial Audio",
      "Lyrics"
    ],
    category: "Music",
    highlight: "Spatial Audio",
    description: "Stream 100 million songs, ad-free with Lossless quality and Spatial Audio support."
  },
  {
    id: "adobe-cc",
    name: "Adobe Creative Cloud",
    price: 52.99,
    rating: 4.6,
    features: [
      "20+ Creative Apps",
      "100GB Cloud Storage",
      "Adobe Fonts",
      "Portfolio Website",
      "Mobile Apps"
    ],
    category: "Productivity",
    highlight: "Complete Suite",
    description: "Get 20+ creative desktop and mobile apps including Photoshop, Illustrator, and more."
  },
  {
    id: "microsoft365",
    name: "Microsoft 365",
    price: 9.99,
    rating: 4.4,
    features: [
      "Word, Excel, PowerPoint",
      "1TB OneDrive Storage",
      "Outlook Email",
      "Microsoft Teams",
      "Mobile Apps"
    ],
    category: "Productivity",
    highlight: "Best Value",
    description: "Get premium Office apps, 1TB cloud storage, and advanced security for your documents."
  },
  {
    id: "amazon-prime",
    name: "Amazon Prime",
    price: 14.99,
    rating: 4.2,
    features: [
      "Prime Video",
      "Free Shipping",
      "Prime Music",
      "Prime Reading",
      "Prime Gaming"
    ],
    category: "Shopping",
    highlight: "All-in-One",
    description: "Fast, free delivery, exclusive deals, award-winning movies and TV shows, and more."
  },
  {
    id: "hulu",
    name: "Hulu",
    price: 7.99,
    rating: 4.0,
    features: [
      "On-demand Streaming",
      "Original Content",
      "Current TV Episodes",
      "Multiple Profiles",
      "Live TV Option"
    ],
    category: "Streaming",
    highlight: "TV Episodes",
    description: "Watch thousands of shows and movies, with plans starting at $7.99/month."
  }
];

const categories = [...new Set(allServices.map(service => service.category))];

export default function CompareServices() {
  const { toast } = useToast();
  const { formatAmount } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [services, setServices] = useState<Service[]>(allServices);

  useEffect(() => {
    let filteredServices = allServices;
    
    if (selectedCategory !== "all") {
      filteredServices = filteredServices.filter(service => 
        service.category === selectedCategory
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredServices = filteredServices.filter(service => 
        service.name.toLowerCase().includes(query) || 
        service.description.toLowerCase().includes(query) ||
        service.features.some(feature => feature.toLowerCase().includes(query))
      );
    }
    
    setServices(filteredServices);
  }, [selectedCategory, searchQuery]);

  const handleViewDetails = (serviceName: string) => {
    toast({
      title: "Loading details",
      description: `Viewing details for ${serviceName}`,
    });
  };

  const getComparisonServices = () => {
    if (services.length === 0) return [];
    
    const categoryMap = new Map<string, Service>();
    services.forEach(service => {
      if (!categoryMap.has(service.category)) {
        categoryMap.set(service.category, service);
      }
    });
    
    return Array.from(categoryMap.values()).slice(0, 3);
  };

  const comparisonServices = getComparisonServices();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Compare Subscription Services
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the perfect subscription service for your needs. Compare features, prices, and more.
          </p>
        </div>

        <div className="grid gap-4 md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Filters:</span>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full sm:w-[200px]">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-[300px]">
              <Input 
                placeholder="Search services..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {services.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <Card key={service.id} className="relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
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
                        {formatAmount(service.price)}
                      </div>
                    </div>
                  </CardTitle>
                  <Badge className="text-xs mt-3 w-fit">{service.category}</Badge>
                  <p className="text-sm text-muted-foreground mt-3">
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
        ) : (
          <div className="p-12 text-center bg-card/50 backdrop-blur-sm rounded-lg">
            <p className="text-muted-foreground">No services found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {comparisonServices.length > 0 && (
          <Card className="mt-12 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Feature Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium text-primary">Feature</div>
                {comparisonServices.map(service => (
                  <div key={service.id} className="font-medium text-center">
                    {service.name}
                  </div>
                ))}
                
                {[
                  "Monthly Price",
                  "Rating",
                  "Category",
                  ...Array.from(new Set(comparisonServices.flatMap(s => s.features))).slice(0, 5)
                ].map((feature) => (
                  <React.Fragment key={feature}>
                    <div className="text-sm py-2 border-t">{feature}</div>
                    {comparisonServices.map(service => (
                      <div key={`${service.id}-${feature}`} className="text-center border-t py-2">
                        {feature === "Monthly Price" ? (
                          <span className="font-semibold text-green-600">{formatAmount(service.price)}</span>
                        ) : feature === "Rating" ? (
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{service.rating}</span>
                          </div>
                        ) : feature === "Category" ? (
                          <Badge variant="outline" className="mx-auto">{service.category}</Badge>
                        ) : service.features.includes(feature) ? (
                          <Check className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-500 mx-auto" />
                        )}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
