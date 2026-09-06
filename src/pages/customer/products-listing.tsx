import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { Chip } from "@/components/ui/chip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/commerce/product-card";
import { categoryList, mockProducts } from "@/lib/mock-products";
import { toast } from "@/components/ui/toaster";
import { useCart } from "@/lib/cart-context";

const PAGE_SIZE = 8;
type SortKey = "relevance" | "price-asc" | "price-desc" | "rating";

export default function ProductsListingPage() {
  const navigate = useNavigate();
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [sort, setSort] = useState<SortKey>("relevance");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const activeCategory = categorySlug ?? "all";

  const filtered = useMemo(() => {
    let result = mockProducts.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    result = result.slice().sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
    return result;
  }, [activeCategory, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goToCategory(slug: string) {
    setPage(1);
    const query = search ? `?q=${encodeURIComponent(search)}` : "";
    navigate(`/categories/${slug}${query}`);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
    setSearchParams(value ? { q: value } : {});
  }

  const title = categorySlug
    ? categoryList.find((c) => c.slug === categorySlug)?.label ?? "All products"
    : search
      ? `Results for "${search}"`
      : "Search products";

  return (
    <div>
      <h1 className="mb-1 font-display text-heading-lg font-semibold text-foreground">{title}</h1>
      <p className="mb-6 text-body-sm text-foreground-muted">{filtered.length} products found</p>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          placeholder="Search products"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onClear={() => handleSearchChange("")}
          className="sm:max-w-xs"
        />
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Sort: Relevance</SelectItem>
            <SelectItem value="price-asc">Sort: Price low to high</SelectItem>
            <SelectItem value="price-desc">Sort: Price high to low</SelectItem>
            <SelectItem value="rating">Sort: Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Chip selected={activeCategory === "all"} onClick={() => goToCategory("all")}>All</Chip>
        {categoryList.map((cat) => (
          <Chip key={cat.slug} selected={activeCategory === cat.slug} onClick={() => goToCategory(cat.slug)}>
            {cat.label}
          </Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<PackageSearch size={20} />}
          title="No products found"
          description="Try a different search term or category."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {paged.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                shopName={product.shopName}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                unit={product.unit}
                outOfStock={product.outOfStock}
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
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
