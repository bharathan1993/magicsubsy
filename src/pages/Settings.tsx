
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function Settings() {
  const { currentCurrency, setCurrency, currencies } = useCurrency();

  return (
    <div className="flex-1 p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Currency Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Display Currency</Label>
              <Select
                value={currentCurrency.code}
                onValueChange={setCurrency}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                All amounts will be displayed in {currentCurrency.code}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
