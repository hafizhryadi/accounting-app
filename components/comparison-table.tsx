import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TrialBalanceEntry } from "@/types/accounting"
import { Card, CardContent } from "@/components/ui/card"

interface ComparisonTableProps {
  originalEntries: TrialBalanceEntry[]
  adjustedEntries: TrialBalanceEntry[]
  originalTotalDebit: number
  originalTotalCredit: number
  adjustedTotalDebit: number
  adjustedTotalCredit: number
}

export default function ComparisonTable({
  originalEntries,
  adjustedEntries,
  originalTotalDebit,
  originalTotalCredit,
  adjustedTotalDebit,
  adjustedTotalCredit,
}: ComparisonTableProps) {
  // Create a map of account numbers to make lookup easier
  const originalMap = new Map<string, { date: string; totalDebit: number; totalCredit: number }>()

  // Sum up original entries by account number
  originalEntries.forEach((entry) => {
    const current = originalMap.get(entry.accountNumber) || { date: entry.date || "", totalDebit: 0, totalCredit: 0 }
    originalMap.set(entry.accountNumber, {
      date: entry.date || current.date,
      totalDebit: current.totalDebit + entry.debit,
      totalCredit: current.totalCredit + entry.credit,
    })
  })

  // Get all unique account numbers from both original and adjusted entries
  const allAccountNumbers = new Set([
    ...adjustedEntries.map((e) => e.accountNumber),
    ...originalEntries.map((e) => e.accountNumber),
  ])

  // Create comparison rows
  const comparisonRows = Array.from(allAccountNumbers)
    .map((accountNumber) => {
      const original = originalMap.get(accountNumber) || { date: "", totalDebit: 0, totalCredit: 0 }
      const adjusted = adjustedEntries.find((e) => e.accountNumber === accountNumber) || {
        date: "",
        accountNumber,
        accountName: "",
        debit: 0,
        credit: 0,
      }

      // Calculate the difference
      const debitDifference = adjusted.debit - original.totalDebit
      const creditDifference = adjusted.credit - original.totalCredit

      return {
        date: adjusted.date || original.date,
        accountNumber,
        accountName:
          adjusted.accountName || originalEntries.find((e) => e.accountNumber === accountNumber)?.accountName || "",
        originalDebit: original.totalDebit,
        originalCredit: original.totalCredit,
        adjustedDebit: adjusted.debit,
        adjustedCredit: adjusted.credit,
        debitDifference,
        creditDifference,
        hasChanged: Math.abs(debitDifference) > 0.01 || Math.abs(creditDifference) > 0.01,
      }
    })
    .sort((a, b) => a.accountNumber.localeCompare(b.accountNumber))

  return (
    <div className="space-y-6">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">Date</TableHead>
              <TableHead className="w-[10%]">Account Number</TableHead>
              <TableHead className="w-[20%]">Account Name</TableHead>
              <TableHead colSpan={2} className="text-center">
                Original Trial Balance
              </TableHead>
              <TableHead colSpan={2} className="text-center">
                Adjusted Trial Balance
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead className="w-[15%]">Debit</TableHead>
              <TableHead className="w-[15%]">Credit</TableHead>
              <TableHead className="w-[15%]">Debit</TableHead>
              <TableHead className="w-[15%]">Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonRows.map((row) => (
              <TableRow key={row.accountNumber} className={row.hasChanged ? "bg-yellow-50" : ""}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.accountNumber}</TableCell>
                <TableCell>{row.accountName}</TableCell>
                <TableCell>{row.originalDebit > 0 ? row.originalDebit.toFixed(2) : ""}</TableCell>
                <TableCell>{row.originalCredit > 0 ? row.originalCredit.toFixed(2) : ""}</TableCell>
                <TableCell className={row.debitDifference !== 0 ? "font-medium text-blue-600" : ""}>
                  {row.adjustedDebit > 0 ? row.adjustedDebit.toFixed(2) : ""}
                </TableCell>
                <TableCell className={row.creditDifference !== 0 ? "font-medium text-blue-600" : ""}>
                  {row.adjustedCredit > 0 ? row.adjustedCredit.toFixed(2) : ""}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="font-bold text-right">
                Total
              </TableCell>
              <TableCell className="font-bold">{originalTotalDebit.toFixed(2)}</TableCell>
              <TableCell className="font-bold">{originalTotalCredit.toFixed(2)}</TableCell>
              <TableCell className="font-bold">{adjustedTotalDebit.toFixed(2)}</TableCell>
              <TableCell className="font-bold">{adjustedTotalCredit.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-50 border border-gray-200 mr-2"></div>
                <span>Account with adjustments</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white border border-gray-200 mr-2"></div>
                <span>Unchanged account</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 font-medium mr-2">Blue text</span>
                <span>Adjusted value</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Summary of Changes</h3>
            <div className="space-y-1">
              <p>Accounts adjusted: {comparisonRows.filter((r) => r.hasChanged).length}</p>
              <p>Total debit adjustments: {(adjustedTotalDebit - originalTotalDebit).toFixed(2)}</p>
              <p>Total credit adjustments: {(adjustedTotalCredit - originalTotalCredit).toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

