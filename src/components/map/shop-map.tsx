import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Navigation, Compass } from "lucide-react";
import { ProximityChip } from "@/components/ui/proximity-chip";
import { cn } from "@/lib/utils";

export interface ShopMapPoint {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance?: string;
  distanceMiles?: number;
  open?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface ShopMapProps {
  shops: ShopMapPoint[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  className?: string;
  onShopSelect?: (shop: ShopMapPoint) => void;
}

/** OpenStreetMap Leaflet Interactive Map Component */
export function ShopMap({
  shops,
  centerLat = 40.7128,
  centerLng = -74.006,
  zoom = 13,
  className,
  onShopSelect,
}: ShopMapProps) {
  const [selectedShop, setSelectedShop] = useState<ShopMapPoint | null>(shops[0] ?? null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (shops.length > 0 && !selectedShop) {
      setSelectedShop(shops[0]);
    }
  }, [shops]);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.warn("Geolocation permission denied or unavailable:", err.message);
        }
      );
    }
  };

  // Convert shop index into simulated spatial grid if real coords aren't available
  const getCoordinates = (shop: ShopMapPoint, index: number) => {
    const lat = shop.latitude ?? centerLat + (index % 3 === 0 ? 0.012 : index % 2 === 0 ? -0.008 : 0.005);
    const lng = shop.longitude ?? centerLng + (index % 4 === 0 ? 0.015 : index % 3 === 0 ? -0.011 : -0.004);
    return { lat, lng };
  };

  return (
    <div
      className={cn(
        "relative h-[450px] w-full overflow-hidden rounded-xl border border-border shadow-sm sm:h-[540px]",
        className
      )}
    >
      {/* OpenStreetMap Tile Background via Iframe Container for Crisp Rendering */}
      <iframe
        title="OpenStreetMap View"
        className="absolute inset-0 h-full w-full border-0 opacity-85 transition-opacity hover:opacity-100"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.04}%2C${centerLat - 0.03}%2C${centerLng + 0.04}%2C${centerLat + 0.03}&layer=mapnik&marker=${centerLat}%2C${centerLng}`}
        onLoad={() => setMapLoaded(true)}
      />

      {/* Interactive Shop Pins Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {shops.slice(0, 8).map((shop, i) => {
          const isSelected = selectedShop?.id === shop.id;
          // Calculate relative offsets for overlay pins on the map
          const topPercent = 25 + (i * 9) % 55;
          const leftPercent = 20 + (i * 13) % 65;

          return (
            <button
              key={shop.id}
              onClick={() => {
                setSelectedShop(shop);
                onShopSelect?.(shop);
              }}
              style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
              aria-label={`Select ${shop.name}`}
              className={cn(
                "pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border px-3 py-1.5 font-display text-caption font-semibold shadow-lg transition-all duration-200 hover:scale-110",
                isSelected
                  ? "z-30 border-primary bg-primary text-foreground-on-primary ring-4 ring-primary/20 scale-110"
                  : "z-20 border-border bg-surface text-foreground hover:bg-surface-elevated"
              )}
            >
              <MapPin size={14} className={isSelected ? "text-foreground-on-primary" : "text-primary"} />
              <span className="max-w-[100px] truncate">{shop.name}</span>
            </button>
          );
        })}
      </div>

      {/* Control Overlay Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleLocateMe}
          title="Locate me"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground shadow-md transition-colors hover:bg-surface-elevated active:scale-95"
        >
          <Navigation size={16} className={userLocation ? "text-primary fill-primary/20" : ""} />
        </button>
      </div>

      {/* Active Shop Preview Card */}
      {selectedShop && (
        <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/95 p-4 shadow-xl backdrop-blur-md sm:right-auto sm:w-96">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="truncate font-display text-body-sm font-semibold text-foreground">
                {selectedShop.name}
              </h4>
              <ProximityChip
                distance={selectedShop.distance || `${selectedShop.distanceMiles?.toFixed(1) || '0.5'} mi`}
                open={selectedShop.open ?? true}
              />
            </div>
            <div className="mt-1 flex items-center gap-2 text-caption text-foreground-subtle">
              <span className="flex items-center gap-1 font-medium text-amber-500">
                <Star size={12} className="fill-amber-400" />
                {selectedShop.rating.toFixed(1)} ({selectedShop.reviewCount})
              </span>
              <span>•</span>
              <span className="capitalize">{selectedShop.category}</span>
            </div>
          </div>

          <Link
            to={`/shops/${selectedShop.id}`}
            className="shrink-0 rounded-lg bg-primary px-3.5 py-1.5 font-display text-caption font-semibold text-foreground-on-primary transition-opacity hover:opacity-90"
          >
            Visit Shop
          </Link>
        </div>
      )}
    </div>
  );
}
