import {
  LayoutDashboard, Package, Boxes, Tags, Megaphone,
  BarChart3, Users, Star, Wallet, FileText, MessageSquare, Settings,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import type { SidebarGroup } from "@/components/layout/sidebar";

const groups: SidebarGroup[] = [
  { items: [{ label: "Overview", to: "/dashboard/shop", icon: LayoutDashboard }] },
  {
    label: "Sell",
    items: [
      { label: "Orders", to: "/dashboard/shop/orders", icon: Package, badge: 5 },
      { label: "Inventory", to: "/dashboard/shop/inventory", icon: Boxes },
      { label: "Products", to: "/dashboard/shop/products", icon: Tags },
      { label: "Promotions", to: "/dashboard/shop/promotions", icon: Megaphone },
    ],
  },
  {
    label: "Grow",
    items: [
      { label: "Analytics", to: "/dashboard/shop/analytics", icon: BarChart3 },
      { label: "Customers", to: "/dashboard/shop/customers", icon: Users },
      { label: "Reviews", to: "/dashboard/shop/reviews", icon: Star },
    ],
  },
  {
    label: "Business",
    items: [
      { label: "Finance", to: "/dashboard/shop/finance", icon: Wallet },
      { label: "Reports", to: "/dashboard/shop/reports", icon: FileText },
    ],
  },
  {
    label: "General",
    items: [
      { label: "Messages", to: "/dashboard/shop/messages", icon: MessageSquare, badge: 2 },
      { label: "Settings", to: "/dashboard/shop/settings", icon: Settings },
    ],
  },
];

export default function ShopOwnerShell() {
  return <DashboardLayout groups={groups} brandLabel="Shop owner" />;
}
