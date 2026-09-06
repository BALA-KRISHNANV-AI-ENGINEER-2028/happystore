import { ScrollText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auditLogs } from "@/lib/mock-admin";

export default function AdminAuditLogsPage() {
  return (
    <div>
      <h1 className="mb-1 flex items-center gap-2 font-display text-heading-lg font-semibold text-foreground">
        <ScrollText size={22} /> Audit logs
      </h1>
      <p className="mb-6 text-body-sm text-foreground-muted">A record of sensitive actions taken across the platform.</p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Actor</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>When</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium text-foreground">{log.actor}</TableCell>
              <TableCell className="text-foreground-muted">{log.action}</TableCell>
              <TableCell className="text-foreground-muted">{log.target}</TableCell>
              <TableCell className="text-caption text-foreground-subtle">{log.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
