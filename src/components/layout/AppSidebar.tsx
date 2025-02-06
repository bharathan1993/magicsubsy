import { Home, CreditCard, PieChart, Bell, Settings, Target, Users, ArrowLeftRight, Store, Shield, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/app" },
  { icon: CreditCard, label: "Subscriptions", path: "/app/subscriptions" },
  { icon: Store, label: "Marketplace", path: "/app/marketplace" },
  { icon: PieChart, label: "Insights", path: "/app/insights" },
  { icon: Target, label: "Budget Goals", path: "/app/budget-goals" },
  { icon: Users, label: "Subscription Sharing", path: "/app/subscription-sharing" },
  { icon: ArrowLeftRight, label: "Compare Services", path: "/app/compare-services" },
  { icon: FileText, label: "Reports", path: "/app/reports" },
  { icon: Bell, label: "Alerts", path: "/app/alerts" },
  { icon: Shield, label: "Security", path: "/app/security" },
  { icon: Settings, label: "Settings", path: "/app/settings" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex items-center p-4">
          <h1 className="text-xl font-bold">SubsTracker</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    data-active={location.pathname === item.path}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}