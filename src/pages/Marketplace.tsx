import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Star, Tag, Clock, Shield } from "lucide-react";

// Mock data for marketplace listings
const marketplaceListings = [
  {
    id: 1,
    name: "Premium Video Streaming Bundle",
    description: "Get access to multiple premium streaming services at a discounted rate",
    price: 29.99,
    discount: 20,
    developer: "StreamTech Solutions",
    category: "Entertainment",
    rating: 4.5,
    features: ["4K Streaming", "Multiple Devices", "No Ads", "Offline Downloads"],
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    name: "Professional Design Suite",
    description: "Complete design toolkit with premium templates and assets",
    price: 49.99,
    discount: 15,
    developer: "DesignPro Labs",
    category: "Productivity",
    rating: 4.8,
    features: ["Cloud Storage", "Template Library", "Collaboration Tools", "Priority Support"],
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    name: "Music Production Studio",
    description: "Professional-grade music production tools and samples",
    price: 39.99,
    discount: 25,
    developer: "AudioTech Inc",
    category: "Music",
    rating: 4.7,
    features: ["Virtual Instruments", "Effect Plugins", "Sample Library", "Recording Tools"],
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
];

export default function Marketplace() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleSubscribe = (listing: typeof marketplaceListings[0]) => {
    toast({
      title: "Subscription Added!",
      description: `You've successfully subscribed to ${listing.name}`,
    });
  };

  const categories = ["all", ...new Set(marketplaceListings.map(item => item.category))];

  const filteredListings = selectedCategory === "all" 
    ? marketplaceListings 
    : marketplaceListings.filter(item => item.category === selectedCategory);

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Subscription Marketplace
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and subscribe to premium services at exclusive discounts
          </p>
        </div>

        <div className="flex gap-2 justify-center flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="relative p-0">
                <img
                  src={listing.image}
                  alt={listing.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge 
                  className="absolute top-4 right-4 bg-red-500"
                >
                  {listing.discount}% OFF
                </Badge>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{listing.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{listing.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{listing.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Tag className="w-4 h-4" />
                    <span>${listing.price}/month</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>{listing.developer}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {listing.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="text-xs bg-gray-100 rounded-full px-3 py-1 text-center"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleSubscribe(listing)}
                >
                  Subscribe Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}