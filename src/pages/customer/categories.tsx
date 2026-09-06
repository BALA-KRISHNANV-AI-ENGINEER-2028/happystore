import { Link, useNavigate } from "react-router-dom";
import { Carrot, Sandwich, Coffee, Pill, ShoppingBag, Utensils, ArrowRight } from "lucide-react";
import { CategoryCard } from "@/components/commerce/category-card";
import { categoryList, mockProducts } from "@/lib/mock-products";

const icons: Record<string, typeof Carrot> = {
  groceries: Carrot,
  bakery: Sandwich,
  cafe: Coffee,
  pharmacy: Pill,
  general: ShoppingBag,
  dining: Utensils,
};

export default function CategoriesPage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="mb-1 font-display text-heading-lg font-semibold text-foreground">Browse categories</h1>
          <p className="text-body-sm text-foreground-muted">Find everything nearby shops have to offer.</p>
        </div>
        <Link to="/categories/all" className="inline-flex items-center gap-1 text-body-sm font-medium text-primary hover:underline">
          View all products <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categoryList.map((cat) => {
          const count = mockProducts.filter((p) => p.category === cat.slug).length;
          return (
            <CategoryCard
              key={cat.slug}
              label={cat.label}
              icon={icons[cat.slug]}
              count={count}
              onClick={() => navigate(`/categories/${cat.slug}`)}
            />
          );
        })}
      </div>
    </div>
  );
}
