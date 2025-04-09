"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TrialBalanceTab from "@/components/trial-balance-tab"
import LedgerTab from "@/components/ledger-tab"
import { Navigation } from "@/components/navigation"
import type { TrialBalanceEntry } from "@/types/accounting"
import { convertToLedger } from "@/lib/accounting"

// Local storage key
const STORAGE_KEY = "trial-balance-data"

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split("T")[0]

// Default trial balance entries
const defaultTrialBalanceEntries: TrialBalanceEntry[] = [
  {
    id: "1",
    date: getTodayDate(),
    accountNumber: "1000",
    accountName: "Cash",
    reference: "GL1",
    debit: 5000,
    credit: 0,
  },
  {
    id: "2",
    date: getTodayDate(),
    accountNumber: "1200",
    accountName: "Accounts Receivable",
    reference: "GL2",
    debit: 3000,
    credit: 0,
  },
  {
    id: "3",
    date: getTodayDate(),
    accountNumber: "1300",
    accountName: "Inventory",
    reference: "GL3",
    debit: 7000,
    credit: 0,
  },
  {
    id: "4",
    date: getTodayDate(),
    accountNumber: "2000",
    accountName: "Accounts Payable",
    reference: "GL4",
    debit: 0,
    credit: 2500,
  },
  {
    id: "5",
    date: getTodayDate(),
    accountNumber: "2100",
    accountName: "Notes Payable",
    reference: "GL5",
    debit: 0,
    credit: 5000,
  },
  {
    id: "6",
    date: getTodayDate(),
    accountNumber: "3000",
    accountName: "Capital",
    reference: "GL6",
    debit: 0,
    credit: 7500,
  },
  {
    id: "7",
    date: getTodayDate(),
    accountNumber: "1000",
    accountName: "Cash",
    reference: "GL7",
    debit: 1000,
    credit: 0,
  },
  {
    id: "8",
    date: getTodayDate(),
    accountNumber: "1200",
    accountName: "Accounts Receivable",
    reference: "GL8",
    debit: 0,
    credit: 1000,
  },
]

export default function TrialBalanceConverter() {
  // State for trial balance entries
  const [trialBalanceEntries, setTrialBalanceEntries] = useState<TrialBalanceEntry[]>([])

  // Load data from local storage on component mount
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY)
        if (storedData) {
          const parsedData = JSON.parse(storedData) as TrialBalanceEntry[]

          // Add date field if it doesn't exist in stored data
          const updatedData = parsedData.map((entry) => ({
            ...entry,
            date: entry.date || getTodayDate(),
          }))

          setTrialBalanceEntries(updatedData)
        } else {
          // If no data in local storage, use default data
          setTrialBalanceEntries(defaultTrialBalanceEntries)
        }
      } catch (error) {
        console.error("Error loading data from local storage:", error)
        setTrialBalanceEntries(defaultTrialBalanceEntries)
      }
    }

    loadFromLocalStorage()
  }, [])

  // Save data to local storage whenever it changes
  useEffect(() => {
    if (trialBalanceEntries.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trialBalanceEntries))
    }
  }, [trialBalanceEntries])

  // Function to add a new empty entry
  const addEntry = () => {
    const newId = (trialBalanceEntries.length + 1).toString()
    setTrialBalanceEntries([
      ...trialBalanceEntries,
      {
        id: newId,
        date: getTodayDate(),
        accountNumber: "",
        accountName: "",
        reference: "",
        debit: 0,
        credit: 0,
      },
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

  // Function to reset data to defaults
  const resetData = () => {
    setTrialBalanceEntries(defaultTrialBalanceEntries)
  }

  // Calculate totals
  const totalDebit = trialBalanceEntries.reduce((sum, entry) => sum + entry.debit, 0)
  const totalCredit = trialBalanceEntries.reduce((sum, entry) => sum + entry.credit, 0)

  // Generate ledger data
  const ledgerData = convertToLedger(trialBalanceEntries)

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-4">Trial Balance to Ledger Converter</h1>

      <Navigation />

      <Tabs defaultValue="trial-balance" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
          <TabsTrigger value="ledger">General Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="trial-balance">
          <TrialBalanceTab
            trialBalanceEntries={trialBalanceEntries}
            totalDebit={totalDebit}
            totalCredit={totalCredit}
            addEntry={addEntry}
            removeEntry={removeEntry}
            updateEntry={updateEntry}
            resetData={resetData}
          />
        </TabsContent>

        <TabsContent value="ledger">
          <LedgerTab ledgerData={ledgerData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

