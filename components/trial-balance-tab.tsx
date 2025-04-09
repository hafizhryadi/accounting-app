"use client"

import { FileDown, Plus, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TrialBalanceEntry } from "@/types/accounting"
import { exportTrialBalanceToXLSX } from "@/lib/accounting"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TrialBalanceTabProps {
  trialBalanceEntries: TrialBalanceEntry[]
  totalDebit: number
  totalCredit: number
  addEntry: () => void
  removeEntry: (id: string) => void
  updateEntry: (id: string, field: keyof TrialBalanceEntry, value: string | number) => void
  resetData: () => void
}

export default function TrialBalanceTab({
  trialBalanceEntries,
  totalDebit,
  totalCredit,
  addEntry,
  removeEntry,
  updateEntry,
  resetData,
}: TrialBalanceTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Trial Balance</CardTitle>
          <CardDescription>
            Enter your trial balance data below. The system will automatically convert it to a general ledger format.
          </CardDescription>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all your trial balance data to the default values. Any unsaved changes will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetData}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[15%]">Date</TableHead>
                  <TableHead className="w-[15%]">Account Number</TableHead>
                  <TableHead className="w-[25%]">Account Name</TableHead>
                  <TableHead className="w-[10%]">Reference</TableHead>
                  <TableHead className="w-[15%]">Debit</TableHead>
                  <TableHead className="w-[15%]">Credit</TableHead>
                  <TableHead className="w-[5%]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trialBalanceEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Input
                        type="date"
                        value={entry.date || ""}
                        onChange={(e) => updateEntry(entry.id, "date", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={entry.accountNumber}
                        onChange={(e) => updateEntry(entry.id, "accountNumber", e.target.value)}
                        placeholder="Account #"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={entry.accountName}
                        onChange={(e) => updateEntry(entry.id, "accountName", e.target.value)}
                        placeholder="Account name"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={entry.reference}
                        onChange={(e) => updateEntry(entry.id, "reference", e.target.value)}
                        placeholder="Ref"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={entry.debit || ""}
                        onChange={(e) => updateEntry(entry.id, "debit", Number.parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={entry.credit || ""}
                        onChange={(e) => updateEntry(entry.id, "credit", Number.parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removeEntry(entry.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} className="font-bold text-right">
                    Total
                  </TableCell>
                  <TableCell className="font-bold">{totalDebit.toFixed(2)}</TableCell>
                  <TableCell className="font-bold">{totalCredit.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {totalDebit !== totalCredit && (
            <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
              Warning: Your trial balance is not balanced. Total debits must equal total credits.
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Your data is automatically saved to your browser's local storage.
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={addEntry} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
        <Button onClick={() => exportTrialBalanceToXLSX(trialBalanceEntries, totalDebit, totalCredit)}>
          <FileDown className="mr-2 h-4 w-4" />
          Export to XLSX
        </Button>
      </CardFooter>
    </Card>
  )
}

