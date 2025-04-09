import Link from "next/link"
import { Download, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function InvoicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link className="flex items-center gap-2 font-semibold" href="#">
          <span className="font-bold">FinanceTrack</span>
        </Link>
        <nav className="hidden flex-1 items-center gap-6 md:flex">
          <Link className="text-sm font-medium text-muted-foreground" href="/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium text-muted-foreground" href="/dashboard/transactions">
            Transactions
          </Link>
          <Link className="text-sm font-medium" href="/dashboard/invoices">
            Invoices
          </Link>
          <Link className="text-sm font-medium text-muted-foreground" href="/dashboard/reports">
            Reports
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">
            <span className="sr-only">Profile</span>
            <span>John Doe</span>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground">Create and manage your client invoices</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="grid flex-1 gap-1">
              <CardTitle>Invoice List</CardTitle>
              <CardDescription>Manage your client invoices and track payments</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search invoices..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-[300px]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>INV-001</TableCell>
                  <TableCell>ABC Corporation</TableCell>
                  <TableCell>Apr 15, 2024</TableCell>
                  <TableCell>May 15, 2024</TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">$2,400.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>INV-002</TableCell>
                  <TableCell>XYZ Ltd</TableCell>
                  <TableCell>Apr 10, 2024</TableCell>
                  <TableCell>May 10, 2024</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">$1,850.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>INV-003</TableCell>
                  <TableCell>123 Inc</TableCell>
                  <TableCell>Apr 05, 2024</TableCell>
                  <TableCell>May 05, 2024</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">$3,200.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>INV-004</TableCell>
                  <TableCell>Tech Solutions</TableCell>
                  <TableCell>Apr 01, 2024</TableCell>
                  <TableCell>May 01, 2024</TableCell>
                  <TableCell>
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">$1,750.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>INV-005</TableCell>
                  <TableCell>Global Enterprises</TableCell>
                  <TableCell>Mar 25, 2024</TableCell>
                  <TableCell>Apr 25, 2024</TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">$4,500.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

