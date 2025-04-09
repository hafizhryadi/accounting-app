import type { TrialBalanceEntry, LedgerEntry } from "@/types/accounting"

// Convert trial balance to ledger with entries grouped by account number
export function convertToLedger(trialBalanceEntries: TrialBalanceEntry[]): LedgerEntry[] {
  // Group entries by account number
  const groupedEntries: { [key: string]: TrialBalanceEntry[] } = {}

  trialBalanceEntries.forEach((entry) => {
    if (!entry.accountNumber) return // Skip entries without account number

    if (!groupedEntries[entry.accountNumber]) {
      groupedEntries[entry.accountNumber] = []
    }

    groupedEntries[entry.accountNumber].push(entry)
  })

  // Convert grouped entries to ledger format
  return Object.keys(groupedEntries)
    .map((accountNumber) => {
      const entries = groupedEntries[accountNumber]
      const accountName = entries[0].accountName // Use the name from the first entry

      // Create ledger entries with running balance
      let runningBalance = 0
      const ledgerItems = entries.map((entry) => {
        const isDebit = entry.debit > 0
        const amount = isDebit ? entry.debit : entry.credit

        // Update running balance
        if (isDebit) {
          runningBalance += amount
        } else {
          runningBalance -= amount
        }

        return {
          date: entry.date || "",
          reference: entry.reference,
          description: "Transaction",
          debit: entry.debit,
          credit: entry.credit,
          balance: runningBalance,
        }
      })

      return {
        accountNumber,
        accountName,
        entries: ledgerItems,
      }
    })
    .sort((a, b) => a.accountNumber.localeCompare(b.accountNumber)) // Sort by account number
}

// Export trial balance to XLSX
export function exportTrialBalanceToXLSX(
  trialBalanceEntries: TrialBalanceEntry[],
  totalDebit: number,
  totalCredit: number,
) {
  // Create CSV content for trial balance (will be converted to XLSX in a real implementation)
  let csvContent = "Date,Account Number,Account Name,Reference,Debit,Credit\n"

  trialBalanceEntries.forEach((entry) => {
    csvContent += `${entry.date || ""},${entry.accountNumber},${entry.accountName},${entry.reference},${entry.debit},${entry.credit}\n`
  })

  csvContent += `Total,,,,${totalDebit},${totalCredit}\n`

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

// Export adjusted trial balance to XLSX
export function exportAdjustedTrialBalanceToXLSX(
  originalEntries: TrialBalanceEntry[],
  adjustments: any[],
  adjustedEntries: TrialBalanceEntry[],
) {
  // Create a map of account numbers to make lookup easier
  const originalMap = new Map<string, { date: string; totalDebit: number; totalCredit: number }>()

  // Sum up original entries by account number
  originalEntries.forEach((entry) => {
    const current = originalMap.get(entry.accountNumber) || { date: "", totalDebit: 0, totalCredit: 0 }
    originalMap.set(entry.accountNumber, {
      date: entry.date || current.date,
      totalDebit: current.totalDebit + entry.debit,
      totalCredit: current.totalCredit + entry.credit,
    })
  })

  // Get all unique account numbers
  const allAccountNumbers = new Set([
    ...adjustedEntries.map((e) => e.accountNumber),
    ...originalEntries.map((e) => e.accountNumber),
  ])

  // Calculate totals
  const originalTotalDebit = originalEntries.reduce((sum, entry) => sum + entry.debit, 0)
  const originalTotalCredit = originalEntries.reduce((sum, entry) => sum + entry.credit, 0)

  const adjustmentTotalDebit = adjustments.reduce((sum: number, adj: any) => sum + adj.adjustmentDebit, 0)
  const adjustmentTotalCredit = adjustments.reduce((sum: number, adj: any) => sum + adj.adjustmentCredit, 0)

  const adjustedTotalDebit = adjustedEntries.reduce((sum, entry) => sum + entry.debit, 0)
  const adjustedTotalCredit = adjustedEntries.reduce((sum, entry) => sum + entry.credit, 0)

  // Create CSV content
  let csvContent =
    "Date,Account Number,Account Name,Original Debit,Original Credit,Adjustment Debit,Adjustment Credit,Adjusted Debit,Adjusted Credit\n"

  // Create comparison rows
  Array.from(allAccountNumbers).forEach((accountNumber) => {
    const original = originalMap.get(accountNumber) || { date: "", totalDebit: 0, totalCredit: 0 }
    const adjustment = adjustments.find((a: any) => a.accountNumber === accountNumber) || {
      date: "",
      adjustmentDebit: 0,
      adjustmentCredit: 0,
    }
    const adjusted = adjustedEntries.find((e) => e.accountNumber === accountNumber) || {
      date: "",
      accountNumber,
      accountName: "",
      debit: 0,
      credit: 0,
    }

    const date = adjusted.date || original.date || adjustment.date || ""

    csvContent += `${date},${accountNumber},${adjusted.accountName},${original.totalDebit},${original.totalCredit},${adjustment.adjustmentDebit},${adjustment.adjustmentCredit},${adjusted.debit},${adjusted.credit}\n`
  })

  // Add totals row
  csvContent += `Total,,,,${originalTotalDebit},${originalTotalCredit},${adjustmentTotalDebit},${adjustmentTotalCredit},${adjustedTotalDebit},${adjustedTotalCredit}\n`

  // Create a blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", "adjusted_trial_balance.xlsx")
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportLedgerToXLSX(ledgerData: LedgerEntry[]) {
  let csvContent = "Date,Account Number,Account Name,Reference,Description,Debit,Credit,Balance\n"

  ledgerData.forEach((ledger) => {
    ledger.entries.forEach((entry) => {
      csvContent += `${entry.date || ""},${ledger.accountNumber},${ledger.accountName},${entry.reference},${entry.description},${entry.debit},${entry.credit},${entry.balance}\n`
    })
  })

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

