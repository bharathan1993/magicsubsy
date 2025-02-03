import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Receipt,
  CreditCard,
  Calendar,
  Shield,
  BarChart,
  FileText,
  ArrowUpDown,
  Clock,
  Activity,
  User,
  History,
} from "lucide-react";
import {
  generateMonthlySpendingReport,
  generateAnnualSpendingReport,
  generateInvoiceHistory,
  generatePlanChangeHistory,
  generateUpcomingPayments
} from "@/utils/reportGenerators";
import { format } from "date-fns";

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  generator?: () => Promise<void>;
  comingSoon?: boolean;
  content?: React.ReactNode;
}

export default function Reports() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("financial");
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch login history
  const { data: loginHistory } = useQuery({
    queryKey: ['loginHistory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('login_history')
        .select('*')
        .order('login_timestamp', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch account audit logs
  const { data: auditLogs } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('account_audit_logs')
        .select('*')
        .order('changed_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const downloadLoginHistory = async () => {
    const { data, error } = await supabase
      .from('login_history')
      .select('*')
      .order('login_timestamp', { ascending: false });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to download login history",
        variant: "destructive",
      });
      return;
    }

    const csvContent = data.map(log => ({
      'Login Time': format(new Date(log.login_timestamp), 'PPpp'),
      'IP Address': log.ip_address,
      'Device Info': log.device_info
    }));

    const headers = ['Login Time', 'IP Address', 'Device Info'];
    const csvString = [
      headers.join(','),
      ...csvContent.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `login-history-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "Login history downloaded successfully",
    });
  };

  const downloadAuditLogs = async () => {
    const { data, error } = await supabase
      .from('account_audit_logs')
      .select('*')
      .order('changed_at', { ascending: false });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to download audit logs",
        variant: "destructive",
      });
      return;
    }

    const csvContent = data.map(log => ({
      'Change Time': format(new Date(log.changed_at), 'PPpp'),
      'Change Type': log.change_type,
      'Details': JSON.stringify(log.changed_fields)
    }));

    const headers = ['Change Time', 'Change Type', 'Details'];
    const csvString = [
      headers.join(','),
      ...csvContent.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `account-changes-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "Account changes log downloaded successfully",
    });
  };

  const handleDownload = async (reportTitle: string, generator: () => Promise<void>) => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating Report",
        description: `Preparing ${reportTitle}...`,
      });
      
      await generator();
      
      toast({
        title: "Report Ready",
        description: `${reportTitle} has been downloaded.`,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const reportCategories = {
    financial: [
      {
        id: "monthly-spending",
        title: "Monthly Spending Report",
        description: "Detailed breakdown of transactions including upgrades, renewals, and downgrades",
        icon: <CreditCard className="h-5 w-5" />,
        generator: generateMonthlySpendingReport,
      },
      {
        id: "annual-spending",
        title: "Annual Spending Report",
        description: "Yearly summary of all payments, refunds, and subscription changes",
        icon: <BarChart className="h-5 w-5" />,
        generator: generateAnnualSpendingReport,
      },
      {
        id: "invoice-history",
        title: "Invoice & Billing History",
        description: "Access and download all past invoices and receipts",
        icon: <Receipt className="h-5 w-5" />,
        generator: generateInvoiceHistory,
      },
    ],
    subscription: [
      {
        id: "plan-changes",
        title: "Plan Change History",
        description: "Track all subscription plan changes including upgrades and downgrades",
        icon: <ArrowUpDown className="h-5 w-5" />,
        generator: generatePlanChangeHistory,
      },
      {
        id: "upcoming-payments",
        title: "Upcoming Payments Report",
        description: "Preview of upcoming charges and renewal dates",
        icon: <Calendar className="h-5 w-5" />,
        generator: generateUpcomingPayments,
      },
    ],
    security: [
      {
        id: "login-history",
        title: "Login & Access History",
        description: "Comprehensive log of login locations, devices, and IP addresses",
        icon: <History className="h-5 w-5" />,
        content: (
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Login Time</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Device Info</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginHistory?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.login_timestamp), 'PPpp')}
                    </TableCell>
                    <TableCell>{log.ip_address}</TableCell>
                    <TableCell>{log.device_info}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button 
              onClick={downloadLoginHistory}
              className="mt-4"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        ),
      },
      {
        id: "account-changes",
        title: "Account Changes Report",
        description: "Track all profile edits, password changes, and contact updates",
        icon: <Activity className="h-5 w-5" />,
        content: (
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Change Time</TableHead>
                  <TableHead>Change Type</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.changed_at), 'PPpp')}
                    </TableCell>
                    <TableCell>{log.change_type}</TableCell>
                    <TableCell>
                      {log.changed_fields ? JSON.stringify(log.changed_fields, null, 2) : 'No details available'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button 
              onClick={downloadAuditLogs}
              className="mt-4"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        ),
      },
    ],
  };

  const ReportCard = ({ report }: { report: ReportType }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-full">{report.icon}</div>
            <CardTitle className="text-lg">{report.title}</CardTitle>
          </div>
        </div>
        <CardDescription>{report.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {report.content ? (
          report.content
        ) : (
          <Button
            onClick={() => report.generator ? handleDownload(report.title, report.generator) : undefined}
            className="w-full"
            disabled={report.comingSoon || isGenerating}
          >
            {report.comingSoon ? (
              "Coming Soon"
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> 
                {isGenerating ? "Generating..." : "Download Report"}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Download comprehensive reports about your subscriptions, spending, and account activity
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
          <TabsTrigger value="subscription">Subscription Reports</TabsTrigger>
          <TabsTrigger value="security">Security Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="grid gap-6 md:grid-cols-2">
          {reportCategories.financial.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </TabsContent>

        <TabsContent value="subscription" className="grid gap-6 md:grid-cols-2">
          {reportCategories.subscription.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </TabsContent>

        <TabsContent value="security" className="grid gap-6 md:grid-cols-2">
          {reportCategories.security.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
