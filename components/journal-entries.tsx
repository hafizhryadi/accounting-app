import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AdjustmentEntry } from "@/types/accounting"

interface JournalEntriesProps {
  adjustments: AdjustmentEntry[]
}

export default function JournalEntries({ adjustments }: JournalEntriesProps) {
  // Group adjustments by description to create journal entries
  const journalEntries: Record<string, AdjustmentEntry[]> = {}

  adjustments.forEach((adj) => {
    if (adj.adjustmentDebit === 0 && adj.adjustmentCredit === 0) return

    const key = adj.description || "Miscellaneous Adjustment"
    if (!journalEntries[key]) {
      journalEntries[key] = []
    }
    journalEntries[key].push(adj)
  })

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Journal Entries</h3>

      {Object.keys(journalEntries).length === 0 ? (
        <p className="text-muted-foreground">No journal entries have been created yet.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(journalEntries).map(([description, entries], index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-md">{description}</CardTitle>
                  <span className="text-sm text-muted-foreground">{entries[0]?.date || "No date"}</span>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Account</TableHead>
                      <TableHead className="w-[30%]">Debit</TableHead>
                      <TableHead className="w-[30%]">Credit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry, entryIndex) => (
                      <TableRow key={entryIndex}>
                        <TableCell className={entry.adjustmentCredit > 0 ? "pl-8" : ""}>
                          {entry.accountNumber} - {entry.accountName}
                        </TableCell>
                        <TableCell>{entry.adjustmentDebit > 0 ? entry.adjustmentDebit.toFixed(2) : ""}</TableCell>
                        <TableCell>{entry.adjustmentCredit > 0 ? entry.adjustmentCredit.toFixed(2) : ""}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-medium">Total</TableCell>
                      <TableCell className="font-medium">
                        {entries.reduce((sum, entry) => sum + entry.adjustmentDebit, 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {entries.reduce((sum, entry) => sum + entry.adjustmentCredit, 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

