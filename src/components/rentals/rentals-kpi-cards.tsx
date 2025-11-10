"use client"

import * as React from "react"
import {
  IconClipboardCheck,
  IconClock,
  IconAlertCircle,
  IconCurrencyDollar,
} from "@tabler/icons-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Rental } from "@/types/rental"
import { cn } from "@/lib/utils"

interface RentalsKPICardsProps {
  rentals: Rental[]
  onCardClick?: (filter: string) => void
}

export function RentalsKPICards({ rentals, onCardClick }: RentalsKPICardsProps) {
  const active = rentals.filter((r) => r.status === "active").length
  const dueThisWeek = rentals.filter((r) => {
    if (r.status !== "active" && r.status !== "due_soon") return false
    const dueDate = new Date(r.dueDate)
    const today = new Date()
    const weekFromNow = new Date(today)
    weekFromNow.setDate(today.getDate() + 7)
    return dueDate <= weekFromNow && dueDate >= today
  }).length
  const overdue = rentals.filter((r) => r.status === "overdue").length
  
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const totalRevenue = rentals
    .filter((r) => {
      const rentalDate = new Date(r.startDate)
      return (
        rentalDate.getMonth() === currentMonth &&
        rentalDate.getFullYear() === currentYear &&
        r.paymentStatus === "paid"
      )
    })
    .reduce((sum, r) => sum + r.totalCost, 0)

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card
        className={cn(
          "@container/card",
          onCardClick && "cursor-pointer hover:bg-muted/50 transition-colors"
        )}
        onClick={() => onCardClick?.("active")}
      >
        <CardHeader>
          <CardDescription>Active Rentals</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {active}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <IconClipboardCheck className="size-4" />
            <span>Currently rented</span>
          </div>
        </CardHeader>
      </Card>
      <Card
        className={cn(
          "@container/card",
          onCardClick && "cursor-pointer hover:bg-muted/50 transition-colors"
        )}
        onClick={() => onCardClick?.("due_soon")}
      >
        <CardHeader>
          <CardDescription>Due This Week</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dueThisWeek}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
            <IconClock className="size-4" />
            <span>Returning soon</span>
          </div>
        </CardHeader>
      </Card>
      <Card
        className={cn(
          "@container/card",
          onCardClick && "cursor-pointer hover:bg-muted/50 transition-colors"
        )}
        onClick={() => onCardClick?.("overdue")}
      >
        <CardHeader>
          <CardDescription>Overdue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {overdue}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <IconAlertCircle className="size-4" />
            <span>Needs attention</span>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue (Month)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(totalRevenue)}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconCurrencyDollar className="size-4" />
            <span>This month</span>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}

