import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NearbyUser {
  id: number;
  name: string;
  location: string;
  distance: string;
  interests: string[];
  joinedDate: string;
}

interface NearbyUserCardProps {
  user: NearbyUser;
  onConnect: (userId: number) => void;
}

export const NearbyUserCard = ({ user, onConnect }: NearbyUserCardProps) => {
  return (
    <div className="p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
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
          onClick={() => onConnect(user.id)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Connect
        </Button>
      </div>
    </div>
  );
};