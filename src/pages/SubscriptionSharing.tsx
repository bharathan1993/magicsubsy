import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calculator, UserPlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { NearbyUserCard } from "@/components/subscription-sharing/NearbyUserCard";
import { SharingOpportunityCard } from "@/components/subscription-sharing/SharingOpportunityCard";
import { LocationSearch } from "@/components/subscription-sharing/LocationSearch";
import { NearbyPartnerRadar } from "@/components/subscription/NearbyPartnerRadar";
import { useCurrency } from "@/contexts/CurrencyContext";

// Mock data
const sharingOpportunities = [
  {
    service: "Netflix",
    plan: "Premium",
    maxUsers: 4,
    individualCost: 19.99,
    sharedCost: 4.99,
    potentialSavings: 15.00,
    availableSlots: 2,
  },
  {
    service: "Spotify Family",
    plan: "Family",
    maxUsers: 6,
    individualCost: 14.99,
    sharedCost: 2.50,
    potentialSavings: 12.49,
    availableSlots: 3,
  },
];

const nearbyUsers = [
  {
    id: 1,
    name: "Alex Smith",
    location: "San Francisco, CA",
    distance: "2.5 miles",
    interests: ["Netflix", "Spotify"],
    joinedDate: "Jan 2024",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    location: "San Francisco, CA",
    distance: "3.1 miles",
    interests: ["Disney+", "YouTube Premium"],
    joinedDate: "Feb 2024",
  },
  {
    id: 3,
    name: "Mike Chen",
    location: "Oakland, CA",
    distance: "5.2 miles",
    interests: ["Netflix", "HBO Max"],
    joinedDate: "Feb 2024",
  },
];

export default function SubscriptionSharing() {
  const [location, setLocation] = useState("");
  const { toast } = useToast();

  const handleSearch = () => {
    toast({
      title: "Search initiated",
      description: "Searching for sharing partners near " + location,
    });
  };

  const handleConnect = (userId: number) => {
    toast({
      title: "Connection request sent",
      description: "We'll notify you when they respond to your request.",
    });
  };

  const handleJoinPlan = (service: string) => {
    toast({
      title: "Plan joined",
      description: `You've joined the ${service} sharing plan.`,
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Family Plans</CardTitle>
              <p className="text-sm text-muted-foreground">
                Available group subscriptions
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">{sharingOpportunities.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Potential Savings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monthly savings from sharing
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calculator className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">
                  ${sharingOpportunities.reduce((acc, curr) => acc + curr.potentialSavings, 0).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Available Slots</CardTitle>
              <p className="text-sm text-muted-foreground">
                Open sharing positions
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <UserPlus className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">
                  {sharingOpportunities.reduce((acc, curr) => acc + curr.availableSlots, 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Radar Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Find Nearby Sharing Partners</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <LocationSearch
                location={location}
                onLocationChange={setLocation}
                onSearch={handleSearch}
              />
              <NearbyPartnerRadar users={nearbyUsers} onConnect={handleConnect} />
              <div className="space-y-4">
                {nearbyUsers.map((user) => (
                  <NearbyUserCard
                    key={user.id}
                    user={user}
                    onConnect={handleConnect}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sharing Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sharingOpportunities.map((opportunity) => (
                  <SharingOpportunityCard
                    key={opportunity.service}
                    opportunity={opportunity}
                    onJoin={handleJoinPlan}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}