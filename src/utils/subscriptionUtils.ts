export const calculateNextBillingDate = (activationDate: string, cycle: string): Date => {
  const date = new Date(activationDate);
  switch (cycle) {
    case "monthly":
      return new Date(date.setMonth(date.getMonth() + 1));
    case "quarterly":
      return new Date(date.setMonth(date.getMonth() + 3));
    case "annual":
      return new Date(date.setFullYear(date.getFullYear() + 1));
    default:
      return new Date(date.setMonth(date.getMonth() + 1));
  }
};