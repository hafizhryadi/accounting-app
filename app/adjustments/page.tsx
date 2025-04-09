"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown, Save } from "lucide-react"
import type { AdjustmentEntry, TrialBalanceEntry } from "@/types/accounting"
import AdjustmentsTable from "@/components/adjustments-table"
import ComparisonTable from "@/components/comparison-table"
import JournalEntries from "@/components/journal-entries"
import { exportAdjustedTrialBalanceToXLSX } from "@/lib/accounting"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Local storage keys
const TRIAL_BALANCE_KEY = "trial-balance-data"
const ADJUSTMENTS_KEY = "trial-balance-adjustments"

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split("T")[0]

export default function AdjustmentsPage() {
  const { toast } = useToast()
  const [originalEntries, setOriginalEntries] = useState<TrialBalanceEntry[]>([])
  const [adjustments, setAdjustments] = useState<AdjustmentEntry[]>([])
  const [adjustedEntries, setAdjustedEntries] = useState<TrialBalanceEntry[]>([])
  const [uniqueAccounts, setUniqueAccounts] = useState<{ accountNumber: string; accountName: string }[]>([])

  // Load original trial balance data
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(TRIAL_BALANCE_KEY)
      if (storedData) {
        const parsedData = JSON.parse(storedData) as TrialBalanceEntry[]

        // Add date field if it doesn't exist in stored data
        const updatedData = parsedData.map((entry) => ({
          ...entry,
          date: entry.date || getTodayDate(),
        }))

        setOriginalEntries(updatedData)

        // Extract unique accounts from trial balance
        const accounts = new Map<string, string>()
        updatedData.forEach((entry) => {
          if (entry.accountNumber && entry.accountName) {
            accounts.set(entry.accountNumber, entry.accountName)
          }
        })

        const uniqueAccountsList = Array.from(accounts.entries())
          .map(([accountNumber, accountName]) => ({
            accountNumber,
            accountName,
          }))
          .sort((a, b) => a.accountNumber.localeCompare(b.accountNumber))

        setUniqueAccounts(uniqueAccountsList)

        // Check for saved adjustments
        const savedAdjustments = localStorage.getItem(ADJUSTMENTS_KEY)
        if (savedAdjustments) {
          const parsedAdjustments = JSON.parse(savedAdjustments)

          // Add date field if it doesn't exist in stored adjustments
          const updatedAdjustments = parsedAdjustments.map((adj: any) => ({
            ...adj,
            date: adj.date || getTodayDate(),
          }))

          setAdjustments(updatedAdjustments)
        } else {
          // Initialize with one empty adjustment
          setAdjustments([
            {
              id: "1",
              date: getTodayDate(),
              accountNumber: "",
              accountName: "",
              description: "",
              adjustmentDebit: 0,
              adjustmentCredit: 0,
            },
          ])
        }
      }
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }, [])

  // Calculate adjusted entries whenever original entries or adjustments change
  useEffect(() => {
    if (originalEntries.length > 0) {
      // Create a map of account numbers to their total debits and credits
      const accountTotals = new Map<string, { date: string; totalDebit: number; totalCredit: number }>()

      // Sum up original entries by account number
      originalEntries.forEach((entry) => {
        const current = accountTotals.get(entry.accountNumber) || {
          date: entry.date || "",
          totalDebit: 0,
          totalCredit: 0,
        }
        accountTotals.set(entry.accountNumber, {
          date: entry.date || current.date,
          totalDebit: current.totalDebit + entry.debit,
          totalCredit: current.totalCredit + entry.credit,
        })
      })

      // Apply adjustments
      adjustments.forEach((adj) => {
        if (!adj.accountNumber) return // Skip entries without account number

        const current = accountTotals.get(adj.accountNumber) || { date: adj.date || "", totalDebit: 0, totalCredit: 0 }
        accountTotals.set(adj.accountNumber, {
          date: adj.date || current.date,
          totalDebit: current.totalDebit + adj.adjustmentDebit,
          totalCredit: current.totalCredit + adj.adjustmentCredit,
        })
      })

      // Create adjusted entries
      const newAdjustedEntries: TrialBalanceEntry[] = []

      // Convert map to array of entries
      accountTotals.forEach((totals, accountNumber) => {
        // Find account name from original entries or adjustments
        const accountInfo =
          originalEntries.find((e) => e.accountNumber === accountNumber) ||
          adjustments.find((adj) => adj.accountNumber === accountNumber)

        if (accountInfo) {
          newAdjustedEntries.push({
            id: accountNumber,
            date: totals.date,
            accountNumber,
            accountName: accountInfo.accountName,
            reference: "ADJ",
            debit: totals.totalDebit,
            credit: totals.totalCredit,
          })
        }
      })

      // Sort by account number
      newAdjustedEntries.sort((a, b) => a.accountNumber.localeCompare(b.accountNumber))

      setAdjustedEntries(newAdjustedEntries)
    }
  }, [originalEntries, adjustments])

  // Add a new adjustment
  const addAdjustment = () => {
    const newId = (adjustments.length + 1).toString()
    setAdjustments([
      ...adjustments,
      {
        id: newId,
        date: getTodayDate(),
        accountNumber: "",
        accountName: "",
        description: "",
        adjustmentDebit: 0,
        adjustmentCredit: 0,
      },
    ])
  }

  // Remove an adjustment
  const removeAdjustment = (id: string) => {
    setAdjustments(adjustments.filter((adj) => adj.id !== id))
  }

  // Update adjustment
  const updateAdjustment = (id: string, field: keyof AdjustmentEntry, value: string | number) => {
    setAdjustments((prev) => prev.map((adj) => (adj.id === id ? { ...adj, [field]: value } : adj)))
  }

  // Save adjustments to local storage
  const saveAdjustments = () => {
    localStorage.setItem(ADJUSTMENTS_KEY, JSON.stringify(adjustments))
    toast({
      title: "Adjustments saved",
      description: "Your adjustments have been saved to local storage.",
    })
  }

  // Apply adjustments to main trial balance
  const applyAdjustments = () => {
    // Check if adjustments balance
    const totalAdjustmentDebit = adjustments.reduce((sum, adj) => sum + adj.adjustmentDebit, 0)
    const totalAdjustmentCredit = adjustments.reduce((sum, adj) => sum + adj.adjustmentCredit, 0)

    if (Math.abs(totalAdjustmentDebit - totalAdjustmentCredit) > 0.01) {
      toast({
        title: "Adjustments not balanced",
        description: "Your adjustments must have equal debits and credits before applying.",
        variant: "destructive",
      })
      return
    }

    // Save adjusted entries as the new trial balance
    localStorage.setItem(TRIAL_BALANCE_KEY, JSON.stringify(adjustedEntries))
    toast({
      title: "Adjustments applied",
      description: "The adjusted trial balance has been saved as your new trial balance.",
    })
  }

  // Calculate totals
  const originalTotalDebit = originalEntries.reduce((sum, entry) => sum + entry.debit, 0)
  const originalTotalCredit = originalEntries.reduce((sum, entry) => sum + entry.credit, 0)

  const adjustmentTotalDebit = adjustments.reduce((sum, adj) => sum + adj.adjustmentDebit, 0)
  const adjustmentTotalCredit = adjustments.reduce((sum, adj) => sum + adj.adjustmentCredit, 0)

  const adjustedTotalDebit = adjustedEntries.reduce((sum, entry) => sum + entry.debit, 0)
  const adjustedTotalCredit = adjustedEntries.reduce((sum, entry) => sum + entry.credit, 0)

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-4">Trial Balance Adjustments</h1>

      <Navigation />

      <div className="grid gap-6">
        <Tabs defaultValue="adjustments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
            <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          </TabsList>

          <TabsContent value="adjustments">
            <Card>
              <CardHeader>
                <CardTitle>Adjustments</CardTitle>
                <CardDescription>
                  Enter adjustment amounts for each account. Ensure that total debits equal total credits.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdjustmentsTable
                  adjustments={adjustments}
                  accounts={uniqueAccounts}
                  updateAdjustment={updateAdjustment}
                  addAdjustment={addAdjustment}
                  removeAdjustment={removeAdjustment}
                  totalDebit={adjustmentTotalDebit}
                  totalCredit={adjustmentTotalCredit}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={saveAdjustments} variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save Adjustments
                </Button>
                <Button
                  onClick={applyAdjustments}
                  disabled={Math.abs(adjustmentTotalDebit - adjustmentTotalCredit) > 0.01}
                >
                  Apply to Trial Balance
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="journal">
            <Card>
              <CardHeader>
                <CardTitle>Journal Entries</CardTitle>
                <CardDescription>View your adjustments as journal entries.</CardDescription>
              </CardHeader>
              <CardContent>
                <JournalEntries adjustments={adjustments} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Comparison</CardTitle>
              <CardDescription>Compare original trial balance with adjusted trial balance.</CardDescription>
            </div>
            <Button onClick={() => exportAdjustedTrialBalanceToXLSX(originalEntries, adjustments, adjustedEntries)}>
              <FileDown className="mr-2 h-4 w-4" />
              Export to XLSX
            </Button>
          </CardHeader>
          <CardContent>
            <ComparisonTable
              originalEntries={originalEntries}
              adjustedEntries={adjustedEntries}
              originalTotalDebit={originalTotalDebit}
              originalTotalCredit={originalTotalCredit}
              adjustedTotalDebit={adjustedTotalDebit}
              adjustedTotalCredit={adjustedTotalCredit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

