import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Navigation, Plus, Minus } from "lucide-react";
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

const MIN_ZOOM = 10;
const MAX_ZOOM = 16;
// Half-width/height of the visible map (in degrees) at the baseline zoom level.
// Each zoom step in/out halves/doubles this, matching standard slippy-map semantics.
const BASE_ZOOM = 13;
const BASE_LAT_DELTA = 0.03;
const BASE_LNG_DELTA = 0.04;

/** OpenStreetMap Leaflet Interactive Map Component */
export function ShopMap({
  shops,
  centerLat = 40.7128,
  centerLng = -74.006,
  zoom: initialZoom = BASE_ZOOM,
  className,
  onShopSelect,
}: ShopMapProps) {
  const [selectedShop, setSelectedShop] = useState<ShopMapPoint | null>(shops[0] ?? null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoom, setZoom] = useState(() => Math.min(Math.max(initialZoom, MIN_ZOOM), MAX_ZOOM));

  useEffect(() => {
    if (shops.length > 0 && !selectedShop) {
      setSelectedShop(shops[0]);
    }
  }, [shops]);

  // Reset the loading overlay whenever the viewport actually changes — the
  // iframe re-fetches its tiles for the new bbox and briefly looks stale.
  useEffect(() => {
    setMapLoaded(false);
  }, [centerLat, centerLng, zoom]);

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

  const zoomIn = () => setZoom((z) => Math.min(z + 1, MAX_ZOOM));
  const zoomOut = () => setZoom((z) => Math.max(z - 1, MIN_ZOOM));

  // Visible map bounds for the current zoom level — smaller deltas as zoom
  // increases (more zoomed in), larger as it decreases, halving/doubling per
  // step just like a real slippy map.
  const { west, east, north, south, latDelta, lngDelta } = useMemo(() => {
    const scale = Math.pow(2, BASE_ZOOM - zoom);
    const latD = BASE_LAT_DELTA * scale;
    const lngD = BASE_LNG_DELTA * scale;
    return {
      latDelta: latD,
      lngDelta: lngD,
      west: centerLng - lngD,
      east: centerLng + lngD,
      north: centerLat + latD,
      south: centerLat - latD,
    };
  }, [centerLat, centerLng, zoom]);

  // Convert shop index into a simulated spatial grid if real coords aren't
  // available, scaled to the current viewport so pins spread sensibly at any zoom.
  const getCoordinates = (shop: ShopMapPoint, index: number) => {
    const lat =
      shop.latitude ??
      centerLat + (index % 3 === 0 ? 0.4 : index % 2 === 0 ? -0.27 : 0.17) * latDelta;
    const lng =
      shop.longitude ??
      centerLng + (index % 4 === 0 ? 0.38 : index % 3 === 0 ? -0.28 : -0.1) * lngDelta;
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
        className={cn(
          "absolute inset-0 h-full w-full border-0 opacity-85 transition-opacity duration-300 hover:opacity-100",
          !mapLoaded && "opacity-0"
        )}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${centerLat}%2C${centerLng}`}
        onLoad={() => setMapLoaded(true)}
      />

      {/* Loading skeleton — shown until the iframe reports the new viewport is ready */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-surface-sunken">
          <span className="text-caption font-medium text-foreground-muted">Loading map…</span>
        </div>
      )}

      {/* Interactive Shop Pins Overlay — positioned by (real or simulated) coordinates */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {shops.slice(0, 8).map((shop, i) => {
          const isSelected = selectedShop?.id === shop.id;
          const { lat, lng } = getCoordinates(shop, i);
          const clampedLat = Math.min(Math.max(lat, south), north);
          const clampedLng = Math.min(Math.max(lng, west), east);
          const topPercent = ((north - clampedLat) / (north - south)) * 100;
          const leftPercent = ((clampedLng - west) / (east - west)) * 100;

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
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-md">
          <button
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            title="Zoom in"
            aria-label="Zoom in"
            className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:bg-surface-elevated active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus size={16} />
          </button>
          <div className="h-px w-full bg-border" />
          <button
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            title="Zoom out"
            aria-label="Zoom out"
            className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:bg-surface-elevated active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          >
            <Minus size={16} />
          </button>
        </div>
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
