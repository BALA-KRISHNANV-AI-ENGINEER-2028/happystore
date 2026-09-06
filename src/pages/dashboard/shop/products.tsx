import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { inventory as seedProducts } from "@/lib/mock-shop-owner";
import { toast } from "@/components/ui/toaster";

const productSchema = z.object({
  name: z.string().min(2, "Enter a product name"),
  category: z.string().min(1, "Select a category"),
  price: z.number({ error: "Enter a price" }).positive("Enter a price greater than 0"),
  description: z.string().optional(),
});
type ProductValues = z.infer<typeof productSchema>;

const categories = ["Dairy", "Bakery", "Beverages", "Produce", "General"];

export default function ShopProductsPage() {
  const [products, setProducts] = useState(seedProducts.map((p) => ({ ...p, description: "" })));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductValues>({ resolver: zodResolver(productSchema) });

  function openAdd() {
    setEditingId(null);
    reset({ name: "", category: "", price: 0, description: "" });
    setDialogOpen(true);
  }

  function openEdit(id: string) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setEditingId(id);
    reset({ name: product.name, category: product.category, price: product.price, description: product.description });
    setDialogOpen(true);
  }

  function removeProduct(id: string) {
    setProducts((current) => current.filter((p) => p.id !== id));
    toast("Product removed");
  }

  async function onSubmit(values: ProductValues) {
    await new Promise((r) => setTimeout(r, 500));
    if (editingId) {
      setProducts((current) => current.map((p) => (p.id === editingId ? { ...p, ...values, description: values.description ?? "" } : p)));
      toast.success("Product updated");
    } else {
      setProducts((current) => [
        { id: `p-${Date.now()}`, stock: 0, lowStockThreshold: 10, ...values, description: values.description ?? "" },
        ...current,
      ]);
      toast.success("Product added");
    }
    setDialogOpen(false);
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-heading-lg font-semibold text-foreground">Products</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="primary" onClick={openAdd}><Plus size={15} /> Add product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit product" : "Add a product"}</DialogTitle>
              <DialogDescription>{editingId ? "Update the details for this product." : "Add a new product to your catalog."}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Product name</Label>
                <Input id="name" invalid={!!errors.name} {...register("name")} />
                {errors.name && <p className="text-caption text-error">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="category"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <p className="text-caption text-error">{errors.category.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" step="0.01" invalid={!!errors.price} {...register("price", { valueAsNumber: true })} />
                  {errors.price && <p className="text-caption text-error">{errors.price.message}</p>}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea id="description" {...register("description")} />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary" loading={isSubmitting}>{editingId ? "Save changes" : "Add product"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <EmptyState icon={<Tags size={20} />} title="No products yet" description="Add your first product to start selling." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                <TableCell className="text-foreground-muted">{product.category}</TableCell>
                <TableCell className="font-mono">${product.price.toFixed(2)}</TableCell>
                <TableCell className="font-mono">{product.stock}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(product.id)}><Pencil size={13} /></Button>
                    <Button variant="ghost" size="sm" onClick={() => removeProduct(product.id)}><Trash2 size={13} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
