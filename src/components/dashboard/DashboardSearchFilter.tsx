import { useState, useRef, useEffect } from "react";
import { Search, X, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Subscription } from "@/types/subscription";
import { useCurrency } from "@/contexts/CurrencyContext";

interface DashboardSearchFilterProps {
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (status: string | null) => void;
  onCategoryFilterChange: (category: string | null) => void;
  selectedStatus: string | null;
  selectedCategory: string | null;
  categories: string[];
  searchValue: string;
  allSubscriptions: Subscription[];
  onSubscriptionSelect: (subscription: Subscription) => void;
}

export function DashboardSearchFilter({
  onSearchChange,
  onStatusFilterChange,
  onCategoryFilterChange,
  selectedStatus,
  selectedCategory,
  categories,
  searchValue,
  allSubscriptions,
  onSubscriptionSelect,
}: DashboardSearchFilterProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const { formatAmount } = useCurrency();

  // Filter subscriptions for autocomplete
  const autocompleteResults = localSearch.trim()
    ? allSubscriptions.filter((sub) =>
        sub.name.toLowerCase().includes(localSearch.toLowerCase())
      ).slice(0, 5) // Limit to 5 results
    : [];

  const statusFilters = [
    { label: "All", value: null },
    { label: "Active", value: "active" },
    { label: "Expired", value: "expired" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onSearchChange(value);
  };

  const clearSearch = () => {
    setLocalSearch("");
    onSearchChange("");
  };

  const hasActiveFilters = selectedStatus || selectedCategory || searchValue;

  const clearAllFilters = () => {
    setLocalSearch("");
    onSearchChange("");
    onStatusFilterChange(null);
    onCategoryFilterChange(null);
    setShowAutocomplete(false);
  };

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showAutocomplete || autocompleteResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < autocompleteResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < autocompleteResults.length) {
          handleSubscriptionClick(autocompleteResults[focusedIndex]);
        }
        break;
      case "Escape":
        setShowAutocomplete(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const handleSubscriptionClick = (subscription: Subscription) => {
    onSubscriptionSelect(subscription);
    setShowAutocomplete(false);
    setLocalSearch("");
    onSearchChange("");
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative" ref={searchRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search subscriptions by name..."
          value={localSearch}
          onChange={(e) => {
            handleSearchChange(e.target.value);
            setShowAutocomplete(true);
            setFocusedIndex(-1);
          }}
          onFocus={() => {
            if (localSearch.trim()) {
              setShowAutocomplete(true);
            }
          }}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {localSearch && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Autocomplete Dropdown */}
        {showAutocomplete && autocompleteResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {autocompleteResults.map((subscription, index) => (
              <button
                key={subscription.id}
                onClick={() => handleSubscriptionClick(subscription)}
                className={cn(
                  "w-full px-4 py-3 flex items-center justify-between hover:bg-accent transition-colors text-left",
                  focusedIndex === index && "bg-accent",
                  index !== autocompleteResults.length - 1 && "border-b"
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{subscription.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {subscription.category}
                    </Badge>
                    <Badge
                      variant={subscription.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {subscription.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col items-end ml-4">
                  <p className="font-semibold">{formatAmount(subscription.amount)}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(subscription.next_billing_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {showAutocomplete && localSearch.trim() && autocompleteResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 p-4 text-center text-sm text-muted-foreground">
            No subscriptions found matching "{localSearch}"
          </div>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-muted-foreground">Filters:</span>
        
        {/* Status Filters */}
        <div className="flex gap-2">
          {statusFilters.map((filter) => (
            <Badge
              key={filter.label}
              variant={selectedStatus === filter.value ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                selectedStatus === filter.value
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-accent"
              )}
              onClick={() => onStatusFilterChange(filter.value)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <div className="h-6 w-px bg-border" />
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-accent"
                )}
                onClick={() =>
                  onCategoryFilterChange(
                    selectedCategory === category ? null : category
                  )
                }
              >
                {category}
              </Badge>
            ))}
          </div>
        )}

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="ml-auto text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filter Count */}
      {hasActiveFilters && (
        <div className="text-xs text-muted-foreground">
          {searchValue && `Search: "${searchValue}"`}
          {searchValue && (selectedStatus || selectedCategory) && " · "}
          {selectedStatus && `Status: ${selectedStatus}`}
          {selectedStatus && selectedCategory && " · "}
          {selectedCategory && `Category: ${selectedCategory}`}
        </div>
      )}
    </div>
  );
}