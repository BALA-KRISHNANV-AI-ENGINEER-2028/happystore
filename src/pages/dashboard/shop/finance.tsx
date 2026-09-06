import { Wallet, ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { transactions } from "@/lib/mock-shop-owner";
import { toast } from "@/components/ui/toaster";

const typeTone: Record<string, "success" | "info" | "error" | "warning"> = {
  sale: "success",
  payout: "info",
  fee: "warning",
  refund: "error",
};

export default function ShopFinancePage() {
  const balance = transactions.reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <h1 className="mb-5 font-display text-heading-lg font-semibold text-foreground">Finance</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-label text-foreground-muted">Current balance</p>
          <p className="mt-1.5 font-display text-heading-md font-semibold text-foreground">${balance.toFixed(2)}</p>
          <p className="mt-1 flex items-center gap-1 text-caption text-success-600"><ArrowUpRight size={12} /> Next payout Jul 16</p>
        </Card>
        <Card className="p-5">
          <p className="text-label text-foreground-muted">This week's sales</p>
          <p className="mt-1.5 font-display text-heading-md font-semibold text-foreground">$3,842.10</p>
          <p className="mt-1 flex items-center gap-1 text-caption text-success-600"><ArrowUpRight size={12} /> 8.4%</p>
        </Card>
        <Card className="p-5">
          <p className="text-label text-foreground-muted">Platform fees</p>
          <p className="mt-1.5 font-display text-heading-md font-semibold text-foreground">$192.30</p>
          <p className="mt-1 flex items-center gap-1 text-caption text-error-600"><ArrowDownRight size={12} /> 5% of sales</p>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between p-5 pb-0">
          <h2 className="flex items-center gap-2 font-display text-body font-semibold text-foreground">
            <Wallet size={16} /> Transaction history
          </h2>
          <Button variant="secondary" size="sm" onClick={() => toast("Preparing statement…")}>
            <Download size={13} /> Export
          </Button>
        </div>
        <div className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-foreground-muted">{t.date}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell><Badge tone={typeTone[t.type]}>{t.type}</Badge></TableCell>
                  <TableCell className={`font-mono ${t.amount < 0 ? "text-error" : "text-success-600"}`}>
                    {t.amount < 0 ? "-" : "+"}${Math.abs(t.amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
