import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
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
} from "lucide-react";

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

export default function Reports() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("financial");

  const handleDownload = (reportTitle: string) => {
    toast({
      title: "Download Started",
      description: `Preparing ${reportTitle} for download...`,
    });
    // Implement actual download logic here
  };

  const reportCategories = {
    financial: [
      {
        id: "monthly-spending",
        title: "Monthly Spending Report",
        description: "Detailed breakdown of transactions including upgrades, renewals, and downgrades",
        icon: <CreditCard className="h-5 w-5" />,
      },
      {
        id: "annual-spending",
        title: "Annual Spending Report",
        description: "Yearly summary of all payments, refunds, and subscription changes",
        icon: <BarChart className="h-5 w-5" />,
      },
      {
        id: "invoice-history",
        title: "Invoice & Billing History",
        description: "Access and download all past invoices and receipts",
        icon: <Receipt className="h-5 w-5" />,
      },
    ],
    subscription: [
      {
        id: "plan-changes",
        title: "Plan Change History",
        description: "Track all subscription plan changes including upgrades and downgrades",
        icon: <ArrowUpDown className="h-5 w-5" />,
      },
      {
        id: "upcoming-payments",
        title: "Upcoming Payments Report",
        description: "Preview of upcoming charges and renewal dates",
        icon: <Calendar className="h-5 w-5" />,
      },
    ],
    security: [
      {
        id: "login-history",
        title: "Login & Access History",
        description: "Comprehensive log of login locations, devices, and IP addresses",
        icon: <Shield className="h-5 w-5" />,
      },
      {
        id: "account-changes",
        title: "Account Changes Report",
        description: "Track all profile edits, password changes, and contact updates",
        icon: <Activity className="h-5 w-5" />,
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
        <Button
          onClick={() => handleDownload(report.title)}
          className="w-full"
          disabled={report.comingSoon}
        >
          {report.comingSoon ? (
            "Coming Soon"
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" /> Download Report
            </>
          )}
        </Button>
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