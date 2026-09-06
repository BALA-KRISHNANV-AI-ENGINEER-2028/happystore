import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { Chip } from "@/components/ui/chip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { ShopCard } from "@/components/commerce/shop-card";
import { ShopMap } from "@/components/commerce/shop-map";
import { mockShops } from "@/lib/mock-shops";

const categories = ["All", "Grocery", "Bakery", "Cafe", "Pharmacy", "General", "Dining"];
const PAGE_SIZE = 4;

type SortKey = "distance" | "rating" | "reviews";

export default function ShopsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [openOnly, setOpenOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("distance");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = mockShops.filter((shop) => {
      const matchesSearch = shop.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || shop.category.includes(category);
      const matchesOpen = !openOnly || shop.open;
      return matchesSearch && matchesCategory && matchesOpen;
    });

    result = result.slice().sort((a, b) => {
      if (sort === "distance") return a.distanceMiles - b.distanceMiles;
      if (sort === "rating") return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });

    return result;
  }, [search, category, openOnly, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateFilter(fn: () => void) {
    fn();
    setPage(1);
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-heading-lg font-semibold text-foreground">Nearby shops</h1>
      <p className="mb-6 text-body-sm text-foreground-muted">{filtered.length} shops near 214 Maple Street</p>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          placeholder="Search shops"
          value={search}
          onChange={(e) => updateFilter(() => setSearch(e.target.value))}
          onClear={() => updateFilter(() => setSearch(""))}
          className="sm:max-w-xs"
        />
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="distance">Sort: Distance</SelectItem>
            <SelectItem value="rating">Sort: Rating</SelectItem>
            <SelectItem value="reviews">Sort: Most reviewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Chip key={c} selected={category === c} onClick={() => updateFilter(() => setCategory(c))}>
            {c}
          </Chip>
        ))}
        <Chip selected={openOnly} onClick={() => updateFilter(() => setOpenOnly((o) => !o))}>
          Open now
        </Chip>
      </div>

      <Tabs defaultValue="list">
        <TabsList className="mb-5">
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Store size={20} />}
              title="No shops match your filters"
              description="Try a different category or clear your search."
            />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paged.map((shop) => (
                  <ShopCard
                    key={shop.id}
                    name={shop.name}
                    category={shop.category}
                    rating={shop.rating}
                    reviewCount={shop.reviewCount}
                    distance={shop.distance}
                    open={shop.open}
                    promoted={shop.promoted}
                    onClick={() => navigate(`/shops/${shop.id}`)}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="map">
          <ShopMap shops={filtered} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
