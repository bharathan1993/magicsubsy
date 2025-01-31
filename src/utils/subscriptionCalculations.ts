export const calculateMonthlyAmount = (amount: number, billingCycle: string): number => {
  switch (billingCycle) {
    case "quarterly":
      return amount / 3;
    case "annual":
      return amount / 12;
    default:
      return amount;
  }
};

export const calculateTotalMonthlySpend = (subscriptions: Array<{ amount: number; billing_cycle: string }>): number => {
  return subscriptions.reduce((acc, sub) => {
    const monthlyAmount = calculateMonthlyAmount(sub.amount, sub.billing_cycle);
    return acc + monthlyAmount;
  }, 0);
};