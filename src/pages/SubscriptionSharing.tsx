import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calculator, UserPlus, ArrowRight, Search, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { NearbyPartnerRadar } from "@/components/subscription/NearbyPartnerRadar";

export default function SubscriptionSharing() {
  const [location, setLocation] = useState("");
  const { toast } = useToast();
  
  // Mock data - replace with actual data in production
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

  // Mock nearby users data - replace with actual API call in production
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
          {/* Left Column: Radar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-6 w-6" />
                Find Nearby Sharing Partners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="max-w-md"
                  />
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
                
                <NearbyPartnerRadar users={nearbyUsers} onConnect={handleConnect} />
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Detailed List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Available Sharing Partners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nearbyUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{user.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {user.distance}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {user.location}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {user.interests.map((interest) => (
                            <Badge
                              key={interest}
                              variant="outline"
                              className="text-xs px-2"
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Member since {user.joinedDate}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="shrink-0"
                        onClick={() => handleConnect(user.id)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sharing Opportunities Section */}
        <Card>
          <CardHeader>
            <CardTitle>Sharing Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sharingOpportunities.map((opportunity) => (
                <div key={opportunity.service} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2 mb-4 md:mb-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{opportunity.service}</h3>
                      <Badge>{opportunity.plan}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Max users: {opportunity.maxUsers} | Available slots: {opportunity.availableSlots}
                    </p>
                  </div>
                  <div className="space-y-2 md:text-right">
                    <div>
                      <p className="text-sm text-muted-foreground">Individual cost: ${opportunity.individualCost}/mo</p>
                      <p className="text-sm text-muted-foreground">Shared cost: ${opportunity.sharedCost}/mo</p>
                      <p className="font-semibold text-green-600">Save ${opportunity.potentialSavings}/mo</p>
                    </div>
                    <Button className="w-full md:w-auto">
                      Join Plan <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}