import React, { createContext, useContext, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

type Currency = {
  code: string;
  symbol: string;
  rate: number; // Exchange rate relative to USD
};

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'JPY', symbol: '¥', rate: 148.12 },
  { code: 'AUD', symbol: 'A$', rate: 1.52 },
];

type CurrencyContextType = {
  currentCurrency: Currency;
  setCurrency: (code: string) => void;
  formatAmount: (amount: number) => string;
  convertAmount: (amount: number) => number;
  currencies: Currency[];
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies[0]);

  const setCurrency = (code: string) => {
    const currency = currencies.find(c => c.code === code);
    if (currency) {
      setCurrentCurrency(currency);
      toast({
        title: "Currency Updated",
        description: `Currency has been changed to ${currency.code}`,
      });
    }
  };

  const formatAmount = (amount: number): string => {
    const convertedAmount = amount * currentCurrency.rate;
    return `${currentCurrency.symbol}${convertedAmount.toFixed(2)}`;
  };

  const convertAmount = (amount: number): number => {
    return amount * currentCurrency.rate;
  };

  const value = {
    currentCurrency,
    setCurrency,
    formatAmount,
    convertAmount,
    currencies
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};