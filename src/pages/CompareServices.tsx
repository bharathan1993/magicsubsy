import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Check, X } from "lucide-react";

const services = [
  {
    name: "Netflix",
    price: 15.99,
    features: [
      "4K Streaming",
      "Multiple Profiles",
      "Downloads",
      "No Ads",
      "Original Content"
    ],
    category: "Streaming"
  },
  {
    name: "Disney+",
    price: 13.99,
    features: [
      "4K Streaming",
      "Multiple Profiles",
      "Downloads",
      "No Ads",
      "Family Content"
    ],
    category: "Streaming"
  }
];

export default function CompareServices() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Compare Services</h1>
          <Badge variant="secondary" className="text-sm">
            Streaming Services
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card key={service.name} className="relative">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{service.name}</span>
                  <div className="flex items-center text-lg font-bold text-green-600">
                    <DollarSign className="h-4 w-4" />
                    {service.price}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {service.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Feature</div>
              <div className="font-medium text-center">Netflix</div>
              <div className="font-medium text-center">Disney+</div>
              
              {[
                "4K Quality",
                "Offline Downloads",
                "Multiple Profiles",
                "Ad-free Experience",
                "Original Content"
              ].map((feature) => (
                <React.Fragment key={feature}>
                  <div className="text-sm">{feature}</div>
                  <div className="text-center">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </div>
                  <div className="text-center">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}