import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import { CustomerLayout } from "@/components/layout/customer-layout";
import { RouteSkeleton } from "@/components/layout/route-skeleton";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { GuestRoute } from "@/components/auth/guest-route";
import { RoleGuard } from "@/components/auth/role-guard";
import { NotFoundPage } from "@/components/error/not-found";
import { ServerErrorPage } from "@/components/error/server-error";

// Every page below the top-level layouts is lazy-loaded. Customer pages,
// auth, dashboards, and internal dev tools are distinct app surfaces —
// splitting them keeps the initial bundle small and means a customer
// browsing shops never downloads checkout logic they haven't reached yet,
// react-hook-form/zod, shop-owner/admin code, or design-system-review pages.
const LandingPage = lazy(() => import("@/pages/marketing/landing"));

const AuthLayout = lazy(() =>
  import("@/components/auth/auth-layout").then((m) => ({ default: m.AuthLayout })),
);
const LoginPage = lazy(() => import("@/pages/auth/login"));
const RegisterPage = lazy(() => import("@/pages/auth/register"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/forgot-password"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/reset-password"));
const VerifyEmailPage = lazy(() => import("@/pages/auth/verify-email"));
const GoogleCallbackPage = lazy(() => import("@/pages/auth/google-callback"));

const HomePage = lazy(() => import("@/pages/customer/home"));
const ShopsPage = lazy(() => import("@/pages/customer/shops"));
const ShopDetailsPage = lazy(() => import("@/pages/customer/shop-details"));
const CategoriesPage = lazy(() => import("@/pages/customer/categories"));
const ProductsListingPage = lazy(() => import("@/pages/customer/products-listing"));
const ProductDetailsPage = lazy(() => import("@/pages/customer/product-details"));
const OffersPage = lazy(() => import("@/pages/customer/offers"));
const CartPage = lazy(() => import("@/pages/customer/cart"));
const CheckoutPage = lazy(() => import("@/pages/customer/checkout"));
const OrdersPage = lazy(() => import("@/pages/customer/orders"));
const OrderDetailsPage = lazy(() => import("@/pages/customer/order-details"));
const NotificationsPage = lazy(() => import("@/pages/customer/notifications"));
const WishlistPage = lazy(() => import("@/pages/customer/wishlist"));
const AccountPage = lazy(() => import("@/pages/customer/account"));
const SettingsPage = lazy(() => import("@/pages/customer/settings"));
const SupportPage = lazy(() => import("@/pages/customer/support"));

const ShopOwnerShell = lazy(() => import("@/pages/dashboard/shop-owner-shell"));
const ShopOverviewPage = lazy(() => import("@/pages/dashboard/shop/overview"));
const ShopOrdersPage = lazy(() => import("@/pages/dashboard/shop/orders"));
const ShopInventoryPage = lazy(() => import("@/pages/dashboard/shop/inventory"));
const ShopProductsPage = lazy(() => import("@/pages/dashboard/shop/products"));
const ShopPromotionsPage = lazy(() => import("@/pages/dashboard/shop/promotions"));
const ShopAnalyticsPage = lazy(() => import("@/pages/dashboard/shop/analytics"));
const ShopCustomersPage = lazy(() => import("@/pages/dashboard/shop/customers"));
const ShopReviewsPage = lazy(() => import("@/pages/dashboard/shop/reviews"));
const ShopFinancePage = lazy(() => import("@/pages/dashboard/shop/finance"));
const ShopReportsPage = lazy(() => import("@/pages/dashboard/shop/reports"));
const ShopMessagesPage = lazy(() => import("@/pages/dashboard/shop/messages"));
const ShopSettingsPage = lazy(() => import("@/pages/dashboard/shop/settings"));

const AdminShell = lazy(() => import("@/pages/dashboard/admin-shell"));
const AdminOverviewPage = lazy(() => import("@/pages/dashboard/admin/overview"));
const AdminUsersPage = lazy(() => import("@/pages/dashboard/admin/users"));
const AdminShopsPage = lazy(() => import("@/pages/dashboard/admin/shops"));
const AdminProductsPage = lazy(() => import("@/pages/dashboard/admin/products"));
const AdminCategoriesPage = lazy(() => import("@/pages/dashboard/admin/categories"));
const AdminOrdersPage = lazy(() => import("@/pages/dashboard/admin/orders"));
const AdminReportsPage = lazy(() => import("@/pages/dashboard/admin/reports"));
const AdminRevenuePage = lazy(() => import("@/pages/dashboard/admin/revenue"));
const AdminAnalyticsPage = lazy(() => import("@/pages/dashboard/admin/analytics"));
const AdminNotificationsPage = lazy(() => import("@/pages/dashboard/admin/notifications"));
const AdminCmsPage = lazy(() => import("@/pages/dashboard/admin/cms"));
const AdminRolesPage = lazy(() => import("@/pages/dashboard/admin/roles"));
const AdminAuditLogsPage = lazy(() => import("@/pages/dashboard/admin/audit-logs"));
const AdminSystemHealthPage = lazy(() => import("@/pages/dashboard/admin/system-health"));
const AdminSettingsPage = lazy(() => import("@/pages/dashboard/admin/settings"));

const DesignTokensPage = lazy(() => import("@/pages/design-tokens"));
const ComponentGalleryPage = lazy(() => import("@/pages/component-gallery"));

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<div className="p-6"><RouteSkeleton /></div>}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  // Public marketing site
  { path: "/", element: withSuspense(<LandingPage />), errorElement: <ServerErrorPage /> },

  // Google OAuth callback — standalone, not gated by GuestRoute/ProtectedRoute
  // since the frontend auth state isn't established yet when this loads.
  {
    path: "/auth/google/callback",
    element: withSuspense(<GoogleCallbackPage />),
    errorElement: <ServerErrorPage />,
  },

  // Authentication
  {
    element: <GuestRoute />,
    errorElement: <ServerErrorPage />,
    children: [
      {
        element: withSuspense(<AuthLayout />),
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
          { path: "/reset-password", element: <ResetPasswordPage /> },
          { path: "/verify-email", element: <VerifyEmailPage /> },
        ],
      }
    ]
  },

  // Authenticated customer app
  {
    element: <ProtectedRoute />,
    errorElement: <ServerErrorPage />,
    children: [
      {
        element: <CustomerLayout />,
        children: [
          { path: "/home", element: <HomePage /> },
          { path: "/shops", element: <ShopsPage /> },
          { path: "/shops/:shopId", element: <ShopDetailsPage /> },
          { path: "/categories", element: <CategoriesPage /> },
          { path: "/categories/:categorySlug", element: <ProductsListingPage /> },
          { path: "/products/:productId", element: <ProductDetailsPage /> },
          { path: "/search", element: <ProductsListingPage /> },
          { path: "/offers", element: <OffersPage /> },
          { path: "/cart", element: <CartPage /> },
          { path: "/checkout", element: <CheckoutPage /> },
          { path: "/orders", element: <OrdersPage /> },
          { path: "/orders/:orderId", element: <OrderDetailsPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/wishlist", element: <WishlistPage /> },
          { path: "/account", element: <AccountPage /> },
          { path: "/settings", element: <SettingsPage /> },
          { path: "/support", element: <SupportPage /> },
        ],
      }
    ]
  },
  {
    path: "/dashboard/shop",
    element: <ProtectedRoute />,
    errorElement: <ServerErrorPage />,
    children: [
      {
        element: <RoleGuard roles={["shop_owner"]} />,
        children: [
          {
            element: withSuspense(<ShopOwnerShell />),
            children: [
              { index: true, element: <ShopOverviewPage /> },
              { path: "orders", element: <ShopOrdersPage /> },
              { path: "inventory", element: <ShopInventoryPage /> },
              { path: "products", element: <ShopProductsPage /> },
              { path: "promotions", element: <ShopPromotionsPage /> },
              { path: "analytics", element: <ShopAnalyticsPage /> },
              { path: "customers", element: <ShopCustomersPage /> },
              { path: "reviews", element: <ShopReviewsPage /> },
              { path: "finance", element: <ShopFinancePage /> },
              { path: "reports", element: <ShopReportsPage /> },
              { path: "messages", element: <ShopMessagesPage /> },
              { path: "settings", element: <ShopSettingsPage /> },
            ],
          }
        ]
      }
    ]
  },
  {
    path: "/dashboard/admin",
    element: <ProtectedRoute />,
    errorElement: <ServerErrorPage />,
    children: [
      {
        element: <RoleGuard roles={["admin"]} />,
        children: [
          {
            element: withSuspense(<AdminShell />),
            children: [
              { index: true, element: <AdminOverviewPage /> },
              { path: "users", element: <AdminUsersPage /> },
              { path: "shops", element: <AdminShopsPage /> },
              { path: "products", element: <AdminProductsPage /> },
              { path: "categories", element: <AdminCategoriesPage /> },
              { path: "orders", element: <AdminOrdersPage /> },
              { path: "reports", element: <AdminReportsPage /> },
              { path: "revenue", element: <AdminRevenuePage /> },
              { path: "analytics", element: <AdminAnalyticsPage /> },
              { path: "notifications", element: <AdminNotificationsPage /> },
              { path: "cms", element: <AdminCmsPage /> },
              { path: "roles", element: <AdminRolesPage /> },
              { path: "audit-logs", element: <AdminAuditLogsPage /> },
              { path: "system-health", element: <AdminSystemHealthPage /> },
              { path: "settings", element: <AdminSettingsPage /> },
            ],
          }
        ]
      }
    ]
  },
  // Internal review routes for earlier phases — not part of the product's IA.
  { path: "/dev/tokens", element: withSuspense(<DesignTokensPage />) },
  { path: "/dev/components", element: withSuspense(<ComponentGalleryPage />) },
  // 404 Catch-all
  { path: "*", element: <NotFoundPage /> },
]);

