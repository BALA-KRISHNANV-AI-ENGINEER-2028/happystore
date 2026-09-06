import {
  LayoutDashboard, Users, Store, Package, LayoutGrid,
  ShoppingBag, BarChart3, TrendingUp, Bell, FileEdit, Settings, Shield, ScrollText, Activity, HeartPulse,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import type { SidebarGroup } from "@/components/layout/sidebar";

const groups: SidebarGroup[] = [
  { items: [{ label: "Dashboard", to: "/dashboard/admin", icon: LayoutDashboard }] },
  {
    label: "Marketplace",
    items: [
      { label: "Users", to: "/dashboard/admin/users", icon: Users },
      { label: "Shops", to: "/dashboard/admin/shops", icon: Store },
      { label: "Products", to: "/dashboard/admin/products", icon: Package },
      { label: "Categories", to: "/dashboard/admin/categories", icon: LayoutGrid },
      { label: "Orders", to: "/dashboard/admin/orders", icon: ShoppingBag },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Reports", to: "/dashboard/admin/reports", icon: BarChart3 },
      { label: "Revenue", to: "/dashboard/admin/revenue", icon: TrendingUp },
      { label: "Analytics", to: "/dashboard/admin/analytics", icon: Activity },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Notifications", to: "/dashboard/admin/notifications", icon: Bell },
      { label: "CMS", to: "/dashboard/admin/cms", icon: FileEdit },
      { label: "Role management", to: "/dashboard/admin/roles", icon: Shield },
      { label: "Audit logs", to: "/dashboard/admin/audit-logs", icon: ScrollText },
      { label: "System health", to: "/dashboard/admin/system-health", icon: HeartPulse },
      { label: "Settings", to: "/dashboard/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminShell() {
  return <DashboardLayout groups={groups} brandLabel="Admin" />;
}
