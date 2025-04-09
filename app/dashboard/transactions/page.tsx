import Link from "next/link"
import { ArrowDown, ArrowUp, Download, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TransactionsPage() {
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
          <Link className="text-sm font-medium" href="/dashboard/transactions">
            Transactions
          </Link>
          <Link className="text-sm font-medium text-muted-foreground" href="/dashboard/invoices">
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
            <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">Manage and track your financial transactions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="grid flex-1 gap-1">
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View and manage all your transactions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-[300px]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Apr 23, 2024</TableCell>
                  <TableCell>Office Supplies</TableCell>
                  <TableCell>Business Expense</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <ArrowDown className="mr-2 h-4 w-4 text-red-500" />
                      Expense
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-red-500">-$350.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 21, 2024</TableCell>
                  <TableCell>Client Payment - ABC Corp</TableCell>
                  <TableCell>Income</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <ArrowUp className="mr-2 h-4 w-4 text-green-500" />
                      Income
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-500">+$2,400.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 18, 2024</TableCell>
                  <TableCell>Software Subscription</TableCell>
                  <TableCell>Software</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <ArrowDown className="mr-2 h-4 w-4 text-red-500" />
                      Expense
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-red-500">-$79.99</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 15, 2024</TableCell>
                  <TableCell>Client Payment - XYZ Ltd</TableCell>
                  <TableCell>Income</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <ArrowUp className="mr-2 h-4 w-4 text-green-500" />
                      Income
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-500">+$1,850.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 12, 2024</TableCell>
                  <TableCell>Rent Payment</TableCell>
                  <TableCell>Rent</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <ArrowDown className="mr-2 h-4 w-4 text-red-500" />
                      Expense
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-red-500">-$1,200.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 10, 2024</TableCell>
                  <TableCell>Utility Bills</TableCell>
                  <TableCell>Utilities</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <ArrowDown className="mr-2 h-4 w-4 text-red-500" />
                      Expense
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-red-500">-$145.50</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 05, 2024</TableCell>
                  <TableCell>Client Payment - 123 Inc</TableCell>
                  <TableCell>Income</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <ArrowUp className="mr-2 h-4 w-4 text-green-500" />
                      Income
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-500">+$3,200.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

