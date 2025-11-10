"use client"

import {
  IconUsers,
  IconUserCheck,
  IconTrendingUp,
  IconStar,
  IconCurrencyDollar,
} from "@tabler/icons-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Customer, CustomerStats } from "@/types/customer"

interface CustomersKPICardsProps {
  customers: Customer[]
  customerStats: CustomerStats[]
}

export function CustomersKPICards({
  customers,
  customerStats,
}: CustomersKPICardsProps) {
  const total = customers.length
  const active = customers.filter((c) => c.status === "active").length
  const totalRentals = customerStats.reduce((sum, s) => sum + s.totalRentals, 0)
  const averageRentals = total > 0 ? Math.round(totalRentals / total) : 0
  
  const topCustomer = customerStats.reduce(
    (top, current) =>
      current.totalRentals > top.totalRentals ? current : top,
    customerStats[0] || null
  )
  const topCustomerName = topCustomer
    ? customers.find((c) => c.id === topCustomer.customerId)?.company ||
      customers.find((c) => c.id === topCustomer.customerId)?.name ||
      "N/A"
    : "N/A"

  const outstandingTotal = customerStats.reduce(
    (sum, s) => sum + s.outstandingBalance,
    0
  )

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {total}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconUsers className="size-4" />
            <span>All customers</span>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {active}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <IconUserCheck className="size-4" />
            <span>Currently active</span>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg Rentals per Customer</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {averageRentals}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconTrendingUp className="size-4" />
            <span>Average rentals</span>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Top Customer</CardDescription>
          <CardTitle className="text-lg font-semibold tabular-nums @[250px]/card:text-xl">
            {topCustomerName}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconStar className="size-4" />
            <span>
              {topCustomer ? `${topCustomer.totalRentals} rentals` : "N/A"}
            </span>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Outstanding Balances</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(outstandingTotal)}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconCurrencyDollar className="size-4" />
            <span>Total outstanding</span>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}

