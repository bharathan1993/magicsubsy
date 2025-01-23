import { Home, CreditCard, PieChart, Bell, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: CreditCard, label: "Subscriptions", path: "/subscriptions" },
  { icon: PieChart, label: "Insights", path: "/insights" },
  { icon: Bell, label: "Alerts", path: "/alerts" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  return (
    <div className="h-screen w-64 bg-zinc-900 text-white p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold">SubsTracker</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}