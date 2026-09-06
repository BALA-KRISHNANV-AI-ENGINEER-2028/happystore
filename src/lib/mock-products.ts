export interface MockCatalogProduct {
  id: string;
  name: string;
  description: string;
  shopId: string;
  shopName: string;
  category: string; // category slug
  price: number;
  compareAtPrice?: number;
  unit?: string;
  outOfStock?: boolean;
  rating: number;
  reviewCount: number;
}

export const categoryList = [
  { slug: "groceries", label: "Groceries" },
  { slug: "bakery", label: "Bakery" },
  { slug: "cafe", label: "Cafe" },
  { slug: "pharmacy", label: "Pharmacy" },
  { slug: "general", label: "General" },
  { slug: "dining", label: "Dining" },
] as const;

export const mockProducts: MockCatalogProduct[] = [
  { id: "milk-1gal", name: "Organic Whole Milk, 1 Gal", description: "Fresh organic whole milk from local dairy farms, pasteurized and vitamin D fortified.", shopId: "corner-market", shopName: "Corner Market", category: "groceries", price: 4.29, unit: "gal", rating: 4.7, reviewCount: 64 },
  { id: "cold-brew", name: "Cold Brew Concentrate", description: "Slow-steeped for 18 hours, smooth and low-acid. Makes up to 6 servings.", shopId: "corner-market", shopName: "Corner Market", category: "groceries", price: 8.99, rating: 4.5, reviewCount: 31 },
  { id: "eggs-dozen", name: "Cage-Free Eggs, Dozen", description: "Large brown eggs from cage-free hens, grade A.", shopId: "corner-market", shopName: "Corner Market", category: "groceries", price: 5.49, rating: 4.8, reviewCount: 52 },
  { id: "avocados-4pk", name: "Avocados, 4-pack", description: "Ripe and ready Hass avocados, perfect for guacamole or toast.", shopId: "corner-market", shopName: "Corner Market", category: "groceries", price: 6.5, rating: 4.4, reviewCount: 22 },
  { id: "sparkling-water", name: "Sparkling Water, 12-pack", description: "Naturally carbonated spring water, unflavored.", shopId: "corner-market", shopName: "Corner Market", category: "groceries", price: 7.99, outOfStock: true, rating: 4.3, reviewCount: 18 },
  { id: "sourdough-loaf", name: "Sourdough Loaf", description: "Naturally leavened, wood-fired sourdough with a crisp crust and open crumb.", shopId: "rivera-bakery", shopName: "Rivera Bakery", category: "bakery", price: 6.5, compareAtPrice: 7.5, rating: 4.9, reviewCount: 87 },
  { id: "croissant-4pk", name: "Croissant, 4-pack", description: "Butter croissants laminated in-house, baked fresh daily.", shopId: "rivera-bakery", shopName: "Rivera Bakery", category: "bakery", price: 7.2, rating: 4.8, reviewCount: 45 },
  { id: "cinnamon-roll", name: "Cinnamon Roll", description: "Soft-baked roll with brown sugar filling and cream cheese glaze.", shopId: "rivera-bakery", shopName: "Rivera Bakery", category: "bakery", price: 3.75, rating: 4.7, reviewCount: 39 },
  { id: "baguette", name: "Baguette", description: "Classic French baguette, crisp crust and airy interior.", shopId: "rivera-bakery", shopName: "Rivera Bakery", category: "bakery", price: 4.0, rating: 4.6, reviewCount: 28 },
  { id: "house-blend-coffee", name: "House Blend Coffee, 12oz Bag", description: "Medium roast blend with notes of cocoa and toasted almond.", shopId: "sunny-side-cafe", shopName: "Sunny Side Cafe", category: "cafe", price: 11.0, rating: 4.8, reviewCount: 56 },
  { id: "everything-bagel", name: "Everything Bagel, 4-pack", description: "Hand-rolled and topped generously with everything seasoning.", shopId: "sunny-side-cafe", shopName: "Sunny Side Cafe", category: "cafe", price: 6.0, rating: 4.6, reviewCount: 24 },
  { id: "allergy-relief", name: "Allergy Relief, 30ct", description: "24-hour non-drowsy allergy relief tablets.", shopId: "green-leaf-pharmacy", shopName: "Green Leaf Pharmacy", category: "pharmacy", price: 12.99, rating: 4.5, reviewCount: 19 },
  { id: "vitamin-d3", name: "Vitamin D3, 90ct", description: "2000 IU softgels to support bone and immune health.", shopId: "green-leaf-pharmacy", shopName: "Green Leaf Pharmacy", category: "pharmacy", price: 9.49, rating: 4.7, reviewCount: 33 },
  { id: "thermometer", name: "Digital Thermometer", description: "Fast 10-second readings with fever alert.", shopId: "green-leaf-pharmacy", shopName: "Green Leaf Pharmacy", category: "pharmacy", price: 14.0, rating: 4.4, reviewCount: 12 },
  { id: "tote-bag", name: "Reusable Tote Bag", description: "Heavy-duty canvas tote, holds up to 30 lbs.", shopId: "harbor-general", shopName: "Harbor General Store", category: "general", price: 8.0, rating: 4.3, reviewCount: 9 },
  { id: "candle-set", name: "Soy Candle, Set of 2", description: "Hand-poured soy candles in cedar and sea salt scents.", shopId: "harbor-general", shopName: "Harbor General Store", category: "general", price: 16.0, rating: 4.6, reviewCount: 14 },
  { id: "family-combo", name: "Family Meal Combo", description: "Serves 4 — choice of two entrees, two sides, and dessert.", shopId: "maple-diner", shopName: "Maple Street Diner", category: "dining", price: 28.0, rating: 4.7, reviewCount: 41 },
  { id: "diner-breakfast", name: "Classic Breakfast Platter", description: "Two eggs any style, hash browns, toast, and choice of meat.", shopId: "maple-diner", shopName: "Maple Street Diner", category: "dining", price: 11.5, rating: 4.5, reviewCount: 37 },
];

export function getProductById(id: string) {
  return mockProducts.find((p) => p.id === id);
}

export function getRelatedProducts(product: MockCatalogProduct, limit = 4) {
  return mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}
