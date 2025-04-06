"use client"

import { useState } from "react"
import { Plus, Trash2, FileDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define types for our data
type TrialBalanceEntry = {
  id: string
  accountNumber: string
  accountName: string
  reference: string
  debit: number
  credit: number
}

type LedgerEntry = {
  accountNumber: string
  accountName: string
  entries: {
    reference: string
    description: string
    debit: number
    credit: number
    balance: number
  }[]
}

export default function TrialBalanceConverter() {
  // State for trial balance entries
  const [trialBalanceEntries, setTrialBalanceEntries] = useState<TrialBalanceEntry[]>([
    { id: "1", accountNumber: "1000", accountName: "Cash", reference: "GL1", debit: 5000, credit: 0 },
    { id: "2", accountNumber: "1200", accountName: "Accounts Receivable", reference: "GL2", debit: 3000, credit: 0 },
    { id: "3", accountNumber: "1300", accountName: "Inventory", reference: "GL3", debit: 7000, credit: 0 },
    { id: "4", accountNumber: "2000", accountName: "Accounts Payable", reference: "GL4", debit: 0, credit: 2500 },
    { id: "5", accountNumber: "2100", accountName: "Notes Payable", reference: "GL5", debit: 0, credit: 5000 },
    { id: "6", accountNumber: "3000", accountName: "Capital", reference: "GL6", debit: 0, credit: 7500 },
  ])

  // Function to add a new empty entry
  const addEntry = () => {
    const newId = (trialBalanceEntries.length + 1).toString()
    setTrialBalanceEntries([
      ...trialBalanceEntries,
      { id: newId, accountNumber: "", accountName: "", reference: "", debit: 0, credit: 0 },
    ])
  }

  // Function to remove an entry
  const removeEntry = (id: string) => {
    setTrialBalanceEntries(trialBalanceEntries.filter((entry) => entry.id !== id))
  }

  // Function to update an entry
  const updateEntry = (id: string, field: keyof TrialBalanceEntry, value: string | number) => {
    setTrialBalanceEntries(trialBalanceEntries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)))
  }

  // Calculate totals
  const totalDebit = trialBalanceEntries.reduce((sum, entry) => sum + entry.debit, 0)
  const totalCredit = trialBalanceEntries.reduce((sum, entry) => sum + entry.credit, 0)

  // Convert trial balance to ledger
  const convertToLedger = (): LedgerEntry[] => {
    return trialBalanceEntries.map((entry) => {
      const isDebit = entry.debit > 0
      const amount = isDebit ? entry.debit : entry.credit

      return {
        accountNumber: entry.accountNumber,
        accountName: entry.accountName,
        entries: [
          {
            reference: entry.reference,
            description: "Opening Balance",
            debit: isDebit ? amount : 0,
            credit: isDebit ? 0 : amount,
            balance: isDebit ? amount : -amount,
          },
        ],
      }
    })
  }

  // Generate ledger data
  const ledgerData = convertToLedger()

  // Export trial balance to XLSX
  const exportTrialBalanceToXLSX = () => {
    // Create CSV content for trial balance (will be converted to XLSX in a real implementation)
    let csvContent = "Account Number,Account Name,Reference,Debit,Credit\n"

    trialBalanceEntries.forEach((entry) => {
      csvContent += `${entry.accountNumber},${entry.accountName},${entry.reference},${entry.debit},${entry.credit}\n`
    })

    csvContent += `Total,,,${totalDebit},${totalCredit}\n`

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "trial_balance.xlsx")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export ledger to XLSX
  const exportLedgerToXLSX = () => {
    // Create CSV content for ledger (will be converted to XLSX in a real implementation)
    let csvContent = ""

    ledgerData.forEach((ledger) => {
      csvContent += `Account Number,${ledger.accountNumber}\n`
      csvContent += `Account Name,${ledger.accountName}\n`
      csvContent += "Reference,Description,Debit,Credit,Balance\n"

      ledger.entries.forEach((entry) => {
        const balanceValue = Math.abs(entry.balance).toFixed(2)
        const balanceType = entry.balance >= 0 ? "Dr" : "Cr"
        csvContent += `${entry.reference},${entry.description},${entry.debit > 0 ? entry.debit.toFixed(2) : ""},${entry.credit > 0 ? entry.credit.toFixed(2) : ""},${balanceValue} ${balanceType}\n`
      })

      csvContent += "\n" // Add empty line between accounts
    })

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "general_ledger.xlsx")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Trial Balance to Ledger Converter</h1>

      <Tabs defaultValue="trial-balance" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
          <TabsTrigger value="ledger">General Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="trial-balance">
          <Card>
            <CardHeader>
              <CardTitle>Trial Balance</CardTitle>
              <CardDescription>
                Enter your trial balance data below. The system will automatically convert it to a general ledger
                format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[15%]">Account Number</TableHead>
                        <TableHead className="w-[30%]">Account Name</TableHead>
                        <TableHead className="w-[15%]">Reference</TableHead>
                        <TableHead className="w-[15%]">Debit</TableHead>
                        <TableHead className="w-[15%]">Credit</TableHead>
                        <TableHead className="w-[10%]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trialBalanceEntries.map((entry) => (
                        <TableRow key={entry.id}>
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
                        <TableCell colSpan={3} className="font-bold text-right">
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
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={addEntry} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
              <Button onClick={exportTrialBalanceToXLSX}>
                <FileDown className="mr-2 h-4 w-4" />
                Export to XLSX
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="ledger">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>General Ledger</CardTitle>
                <CardDescription>This is the general ledger view generated from your trial balance.</CardDescription>
              </div>
              <Button onClick={exportLedgerToXLSX}>
                <FileDown className="mr-2 h-4 w-4" />
                Export to XLSX
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {ledgerData.map((ledger, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-bold text-lg">
                      {ledger.accountNumber} - {ledger.accountName}
                    </h3>
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
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
                              <TableCell>{entry.reference}</TableCell>
                              <TableCell>{entry.description}</TableCell>
                              <TableCell>{entry.debit > 0 ? entry.debit : ""}</TableCell>
                              <TableCell>{entry.credit > 0 ? entry.credit : ""}</TableCell>
                              <TableCell>
                                {Math.abs(entry.balance)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

