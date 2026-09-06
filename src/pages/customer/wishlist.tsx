import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ShopCard } from "@/components/commerce/shop-card";
import { ProductCard } from "@/components/commerce/product-card";
import { getProductById } from "@/lib/mock-products";
import { toast } from "@/components/ui/toaster";
import { useCart } from "@/lib/cart-context";

interface SavedShop {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance: string;
}

const initialShops: SavedShop[] = [
  { id: "corner-market", name: "Corner Market", category: "Grocery · Convenience", rating: 4.8, reviewCount: 212, distance: "0.4 mi" },
  { id: "rivera-bakery", name: "Rivera Bakery", category: "Bakery · Cafe", rating: 4.6, reviewCount: 98, distance: "0.7 mi" },
  { id: "green-leaf-pharmacy", name: "Green Leaf Pharmacy", category: "Pharmacy", rating: 4.4, reviewCount: 54, distance: "1.1 mi" },
];

const initialProductIds = ["milk-1gal", "sourdough-loaf"];

export default function WishlistPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [shops, setShops] = useState(initialShops);
  const [productIds, setProductIds] = useState(initialProductIds);
  const products = productIds.map((id) => getProductById(id)!).filter(Boolean);

  function removeShop(id: string, name: string) {
    setShops((s) => s.filter((shop) => shop.id !== id));
    toast(`Removed ${name} from saved shops`);
  }

  function removeProduct(id: string, name: string) {
    setProductIds((ids) => ids.filter((pid) => pid !== id));
    toast(`Removed ${name} from wishlist`);
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-heading-lg font-semibold text-foreground">Wishlist</h1>

      <Tabs defaultValue="shops">
        <TabsList>
          <TabsTrigger value="shops">Shops ({shops.length})</TabsTrigger>
          <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="shops">
          {shops.length === 0 ? (
            <EmptyState
              icon={<Heart size={20} />}
              title="No saved shops yet"
              description="Shops you save will show up here for quick access."
              action={<Button variant="secondary" size="sm" asChild><Link to="/shops">Browse shops</Link></Button>}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shops.map((shop) => (
                <div key={shop.id} className="relative">
                  <button
                    onClick={() => removeShop(shop.id, shop.name)}
                    aria-label={`Remove ${shop.name} from saved shops`}
                    className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-surface/90 text-error shadow-sm backdrop-blur"
                  >
                    <Heart size={14} className="fill-error" />
                  </button>
                  <ShopCard
                    name={shop.name}
                    category={shop.category}
                    rating={shop.rating}
                    reviewCount={shop.reviewCount}
                    distance={shop.distance}
                    onClick={() => navigate(`/shops/${shop.id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="products">
          {products.length === 0 ? (
            <EmptyState
              icon={<Heart size={20} />}
              title="No saved products yet"
              description="Products you save while browsing will show up here."
              action={<Button variant="secondary" size="sm" asChild><Link to="/categories">Browse products</Link></Button>}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  shopName={product.shopName}
                  price={product.price}
                  compareAtPrice={product.compareAtPrice}
                  unit={product.unit}
                  outOfStock={product.outOfStock}
                  saved
                  onToggleSave={() => removeProduct(product.id, product.name)}
                  onClick={() => navigate(`/products/${product.id}`)}
                  onAdd={() => {
                    addItem({
                      productId: product.id,
                      name: product.name,
                      shopId: product.shopId,
                      shopName: product.shopName,
                      price: product.price,
                      unit: product.unit,
                    });
                    toast.success("Added to cart", { description: product.name });
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
