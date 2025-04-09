import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { LedgerEntry } from "@/types/accounting"

interface LedgerTableProps {
  ledger: LedgerEntry
}

export default function LedgerTable({ ledger }: LedgerTableProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-bold text-lg">
        {ledger.accountNumber} - {ledger.accountName}
      </h3>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ledger.entries.map((entry, entryIndex) => (
              <TableRow key={entryIndex}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.reference}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>{entry.debit > 0 ? entry.debit.toFixed(2) : ""}</TableCell>
                <TableCell>{entry.credit > 0 ? entry.credit.toFixed(2) : ""}</TableCell>
                <TableCell>
                  {Math.abs(entry.balance).toFixed(2)} {entry.balance >= 0 ? "Dr" : "Cr"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

