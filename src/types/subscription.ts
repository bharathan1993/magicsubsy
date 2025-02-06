export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billing_cycle: string;
  next_billing_date: string;
  category: string;
  website_url: string | null;
  activation_date: string;
  subscription_type: string;
  status: string;
}