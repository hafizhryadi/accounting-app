"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AdjustmentEntry } from "@/types/accounting"

interface AdjustmentsTableProps {
  adjustments: AdjustmentEntry[]
  accounts: { accountNumber: string; accountName: string }[]
  updateAdjustment: (id: string, field: keyof AdjustmentEntry, value: string | number) => void
  addAdjustment: () => void
  removeAdjustment: (id: string) => void
  totalDebit: number
  totalCredit: number
}

export default function AdjustmentsTable({
  adjustments,
  accounts,
  updateAdjustment,
  addAdjustment,
  removeAdjustment,
  totalDebit,
  totalCredit,
}: AdjustmentsTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[15%]">Date</TableHead>
              <TableHead className="w-[15%]">Account</TableHead>
              <TableHead className="w-[25%]">Description</TableHead>
              <TableHead className="w-[20%]">Debit</TableHead>
              <TableHead className="w-[20%]">Credit</TableHead>
              <TableHead className="w-[5%]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adjustments.map((adjustment) => (
              <TableRow key={adjustment.id}>
                <TableCell>
                  <Input
                    type="date"
                    value={adjustment.date}
                    onChange={(e) => updateAdjustment(adjustment.id, "date", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={adjustment.accountNumber}
                    onValueChange={(value) => {
                      updateAdjustment(adjustment.id, "accountNumber", value)
                      const selectedAccount = accounts.find((acc) => acc.accountNumber === value)
                      if (selectedAccount) {
                        updateAdjustment(adjustment.id, "accountName", selectedAccount.accountName)
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.accountNumber} value={account.accountNumber}>
                          {account.accountNumber} - {account.accountName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    value={adjustment.description}
                    onChange={(e) => updateAdjustment(adjustment.id, "description", e.target.value)}
                    placeholder="Adjustment description"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={adjustment.adjustmentDebit || ""}
                    onChange={(e) =>
                      updateAdjustment(adjustment.id, "adjustmentDebit", Number.parseFloat(e.target.value) || 0)
                    }
                    placeholder="0.00"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={adjustment.adjustmentCredit || ""}
                    onChange={(e) =>
                      updateAdjustment(adjustment.id, "adjustmentCredit", Number.parseFloat(e.target.value) || 0)
                    }
                    placeholder="0.00"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => removeAdjustment(adjustment.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} className="font-bold text-right">
                Total
              </TableCell>
              <TableCell className="font-bold">{totalDebit.toFixed(2)}</TableCell>
              <TableCell className="font-bold">{totalCredit.toFixed(2)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <Button onClick={addAdjustment} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Adjustment
        </Button>

        {Math.abs(totalDebit - totalCredit) > 0.01 && (
          <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
            Warning: Your adjustments are not balanced. Total debits must equal total credits.
          </div>
        )}
      </div>
    </div>
  )
}

