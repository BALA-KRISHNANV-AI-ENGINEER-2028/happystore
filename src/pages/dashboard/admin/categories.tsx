import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, LayoutGrid } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { adminCategories as seedCategories } from "@/lib/mock-admin";
import { toast } from "@/components/ui/toaster";

interface CategoryForm {
  name: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(seedCategories);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<CategoryForm>();

  function onSubmit(values: CategoryForm) {
    setCategories((current) => [
      { id: `cat-${Date.now()}`, name: values.name, slug: values.name.toLowerCase().replace(/\s+/g, "-"), productCount: 0 },
      ...current,
    ]);
    toast.success("Category added");
    reset();
    setOpen(false);
  }

  function remove(id: string) {
    setCategories((current) => current.filter((c) => c.id !== id));
    toast("Category removed");
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-heading-lg font-semibold text-foreground">Categories</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="primary"><Plus size={15} /> Add category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a category</DialogTitle>
              <DialogDescription>Categories help shoppers browse the marketplace by type.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Category name</Label>
                <Input id="name" placeholder="Pet supplies" required {...register("name")} />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Add category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <EmptyState icon={<LayoutGrid size={20} />} title="No categories yet" description="Add one to help shoppers browse the marketplace." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Card key={cat.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-body-sm font-medium text-foreground">{cat.name}</p>
                <p className="text-caption text-foreground-subtle">{cat.productCount} products · /{cat.slug}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => remove(cat.id)}><Trash2 size={14} /></Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
