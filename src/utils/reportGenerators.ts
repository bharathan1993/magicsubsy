import { supabase } from "@/integrations/supabase/client";

// Helper to format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Convert data to CSV
const convertToCSV = (data: any[]) => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => 
    headers.map(header => 
      typeof obj[header] === 'string' && obj[header].includes(',') 
        ? `"${obj[header]}"` 
        : obj[header]
    ).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
};

// Download helpers
const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateMonthlySpendingReport = async () => {
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const reportData = subscriptions.map(sub => ({
    Name: sub.name,
    Amount: formatCurrency(Number(sub.amount)),
    'Billing Cycle': sub.billing_cycle,
    Category: sub.category,
    'Next Billing': formatDate(new Date(sub.next_billing_date)),
    Status: sub.status
  }));

  const csv = convertToCSV(reportData);
  downloadCSV(csv, `monthly-spending-report-${new Date().toISOString().split('T')[0]}.csv`);
};

export const generateAnnualSpendingReport = async () => {
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*');

  if (error) throw error;

  const annualData = subscriptions.map(sub => {
    let annualCost = Number(sub.amount);
    if (sub.billing_cycle === 'monthly') annualCost *= 12;
    if (sub.billing_cycle === 'quarterly') annualCost *= 4;

    return {
      Name: sub.name,
      'Monthly Cost': formatCurrency(Number(sub.amount)),
      'Annual Cost': formatCurrency(annualCost),
      Category: sub.category,
      'Start Date': formatDate(new Date(sub.activation_date))
    };
  });

  const csv = convertToCSV(annualData);
  downloadCSV(csv, `annual-spending-report-${new Date().toISOString().split('T')[0]}.csv`);
};

export const generateInvoiceHistory = async () => {
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*')
    .order('next_billing_date', { ascending: false });

  if (error) throw error;

  const invoiceData = subscriptions.map(sub => ({
    'Service Name': sub.name,
    Amount: formatCurrency(Number(sub.amount)),
    'Billing Date': formatDate(new Date(sub.next_billing_date)),
    Status: 'Paid',
    'Payment Method': 'Credit Card'
  }));

  const csv = convertToCSV(invoiceData);
  downloadCSV(csv, `invoice-history-${new Date().toISOString().split('T')[0]}.csv`);
};

export const generatePlanChangeHistory = async () => {
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;

  const changeData = subscriptions.map(sub => ({
    'Service Name': sub.name,
    'Current Plan': `${sub.billing_cycle} - ${formatCurrency(Number(sub.amount))}`,
    'Last Updated': formatDate(new Date(sub.updated_at || '')),
    Status: sub.status
  }));

  const csv = convertToCSV(changeData);
  downloadCSV(csv, `plan-changes-${new Date().toISOString().split('T')[0]}.csv`);
};

export const generateUpcomingPayments = async () => {
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*')
    .order('next_billing_date', { ascending: true });

  if (error) throw error;

  const upcomingData = subscriptions.map(sub => ({
    'Service Name': sub.name,
    Amount: formatCurrency(Number(sub.amount)),
    'Due Date': formatDate(new Date(sub.next_billing_date)),
    'Billing Cycle': sub.billing_cycle,
    Status: sub.status
  }));

  const csv = convertToCSV(upcomingData);
  downloadCSV(csv, `upcoming-payments-${new Date().toISOString().split('T')[0]}.csv`);
};