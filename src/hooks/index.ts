// Happy Store — Hooks barrel export
export { useAuth } from "./useAuth";
export { useShops, useShopById, useNearbyShops } from "./useShops";
export { useProducts, useProductById, useRelatedProducts } from "./useProducts";
export { useCategories } from "./useCategories";
export { useOrdersQuery, useOrderById, usePlaceOrder, useCancelOrder } from "./useOrdersQuery";
export { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "./useWishlist";
export { useNotificationsQuery, useMarkNotificationRead, useMarkAllNotificationsRead } from "./useNotifications";
export { useSearch, useSearchSuggestions } from "./useSearch";
export { useLocalStorage } from "./useLocalStorage";
export { usePagination } from "./usePagination";
