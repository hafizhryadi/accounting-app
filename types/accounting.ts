// Define types for our data
export type TrialBalanceEntry = {
  id: string
  date: string
  accountNumber: string
  accountName: string
  reference: string
  debit: number
  credit: number
}

export type LedgerEntryItem = {
  date: string
  reference: string
  description: string
  debit: number
  credit: number
  balance: number
}

export type LedgerEntry = {
  accountNumber: string
  accountName: string
  entries: LedgerEntryItem[]
}

export type AdjustmentEntry = {
  id: string
  date: string
  accountNumber: string
  accountName: string
  description: string
  adjustmentDebit: number
  adjustmentCredit: number
}

export type JournalEntry = {
  id: string
  description: string
  date: string
  entries: {
    accountNumber: string
    accountName: string
    debit: number
    credit: number
  }[]
}

