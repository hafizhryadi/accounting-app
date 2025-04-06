import Link from "next/link"
import { BarChart3, Download, LineChart, PieChart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
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
          <Link className="text-sm font-medium text-muted-foreground" href="/dashboard/invoices">
            Invoices
          </Link>
          <Link className="text-sm font-medium" href="/dashboard/reports">
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
            <h1 className="text-2xl font-bold tracking-tight">Financial Reports</h1>
            <p className="text-muted-foreground">Analyze your financial performance with detailed reports</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Reports
            </Button>
          </div>
        </div>
        <Tabs defaultValue="income" className="space-y-4">
          <TabsList>
            <TabsTrigger value="income">Income Report</TabsTrigger>
            <TabsTrigger value="expenses">Expense Report</TabsTrigger>
            <TabsTrigger value="profit">Profit & Loss</TabsTrigger>
          </TabsList>
          <TabsContent value="income" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Income Overview</CardTitle>
                <CardDescription>View your income trends over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                  <LineChart className="h-16 w-16 text-gray-400" />
                  <span className="ml-2 text-gray-500">Income Chart</span>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Monthly Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$15,077.30</div>
                  <p className="text-xs text-muted-foreground">For the last 3 months</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Income Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Client Services</div>
                  <p className="text-xs text-muted-foreground">75% of total income</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Analyze your expense categories</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                  <PieChart className="h-16 w-16 text-gray-400" />
                  <span className="ml-2 text-gray-500">Expense Chart</span>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,234.59</div>
                  <p className="text-xs text-muted-foreground">+4.3% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Largest Expense Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Rent & Utilities</div>
                  <p className="text-xs text-muted-foreground">32% of total expenses</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Monthly Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$4,078.20</div>
                  <p className="text-xs text-muted-foreground">For the last 3 months</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="profit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profit & Loss Statement</CardTitle>
                <CardDescription>View your financial performance over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                  <BarChart3 className="h-16 w-16 text-gray-400" />
                  <span className="ml-2 text-gray-500">Profit & Loss Chart</span>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$32,997.30</div>
                  <p className="text-xs text-muted-foreground">+10.2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">72.9%</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Year-to-Date Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$98,754.21</div>
                  <p className="text-xs text-muted-foreground">+15.3% from last year</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

