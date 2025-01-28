import { Home, CreditCard, PieChart, Bell, Settings, Target, Users, ArrowLeftRight, Store } from "lucide-react";
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
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: CreditCard, label: "Subscriptions", path: "/subscriptions" },
  { icon: Store, label: "Marketplace", path: "/marketplace" },
  { icon: PieChart, label: "Insights", path: "/insights" },
  { icon: Target, label: "Budget Goals", path: "/budget-goals" },
  { icon: Users, label: "Subscription Sharing", path: "/subscription-sharing" },
  { icon: ArrowLeftRight, label: "Compare Services", path: "/compare-services" },
  { icon: Bell, label: "Alerts", path: "/alerts" },
  { icon: Settings, label: "Settings", path: "/settings" },
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