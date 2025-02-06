import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface LocationSearchProps {
  location: string;
  onLocationChange: (location: string) => void;
  onSearch: () => void;
}

export const LocationSearch = ({ location, onLocationChange, onSearch }: LocationSearchProps) => {
  return (
    <div className="flex gap-4">
      <Input
        placeholder="Enter your location"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        className="max-w-md"
      />
      <Button onClick={onSearch}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
};