"use client"

import { FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LedgerEntry } from "@/types/accounting"
import { exportLedgerToXLSX } from "@/lib/accounting"
import LedgerTable from "./ledger-table"

interface LedgerTabProps {
  ledgerData: LedgerEntry[]
}

export default function LedgerTab({ ledgerData }: LedgerTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>General Ledger</CardTitle>
          <CardDescription>This is the general ledger view generated from your trial balance.</CardDescription>
        </div>
        <Button onClick={() => exportLedgerToXLSX(ledgerData)}>
          <FileDown className="mr-2 h-4 w-4" />
          Export to XLSX
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {ledgerData.map((ledger, index) => (
            <LedgerTable key={index} ledger={ledger} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

