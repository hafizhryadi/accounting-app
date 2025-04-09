"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  return (
    <div className="flex items-center space-x-4 lg:space-x-6 mb-8">
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Trial Balance
      </Link>
      <Link
        href="/adjustments"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/adjustments" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Adjustments
      </Link>
    </div>
  )
}

