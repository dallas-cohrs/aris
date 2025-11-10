"use client"

import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  IconEdit,
  IconMail,
  IconPhone,
  IconMapPin,
  IconNotes,
  IconCurrencyDollar,
  IconUser,
  IconBuilding,
  IconCalendar,
  IconPackage,
  IconPlus,
  IconX,
} from "@tabler/icons-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Customer, CustomerStatus, CustomerStats, CustomerHealth } from "@/types/customer"
import { Rental } from "@/types/rental"
import { cn } from "@/lib/utils"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface CustomerDetailDrawerProps {
  customer: Customer | null
  customerStats: CustomerStats | null
  rentals: Rental[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (customer: Customer) => void
  onNewRental?: (customer: Customer) => void
  onDeactivate?: (customer: Customer) => void
  onSendReminder?: (customer: Customer) => void
}

const statusColors: Record<CustomerStatus, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const getCustomerHealth = (
  customer: Customer,
  stats: CustomerStats | null,
  rentals: Rental[]
): CustomerHealth => {
  if (!stats) return "good"
  if (stats.outstandingBalance > 0) return "critical"
  if (stats.activeRentals > 0) {
    // Check for overdue rentals
    const hasOverdue = rentals.some(
      (r) =>
        r.customerId === customer.id &&
        r.status === "overdue"
    )
    if (hasOverdue) return "critical"
    return "warning"
  }
  return "good"
}

export function CustomerDetailDrawer({
  customer,
  customerStats,
  rentals,
  open,
  onOpenChange,
  onEdit,
  onNewRental,
  onDeactivate,
  onSendReminder,
}: CustomerDetailDrawerProps) {
  const isMobile = useIsMobile()

  if (!customer) return null

  const health = getCustomerHealth(customer, customerStats, rentals)
  const activeRentals = rentals.filter(
    (r) => r.customerId === customer.id && r.status !== "returned"
  )
  const rentalHistory = rentals
    .filter((r) => r.customerId === customer.id)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  const healthColors = {
    good: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  }

  const healthLabels = {
    good: "🟢 On time",
    warning: "🟡 Pending return",
    critical: "🔴 Overdue",
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent className="max-h-[96vh]">
        <DrawerHeader className="gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DrawerTitle>{customer.name}</DrawerTitle>
                <DrawerDescription>
                  {customer.company || "Individual Customer"}
                </DrawerDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn("capitalize", statusColors[customer.status])}
              >
                {customer.status === "active" ? "🟢 Active" : "⚪ Inactive"}
              </Badge>
              {customerStats && (
                <Badge
                  variant="outline"
                  className={cn("capitalize", healthColors[health])}
                >
                  {healthLabels[health]}
                </Badge>
              )}
            </div>
          </div>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="rentals">Rentals</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <IconUser className="size-4" />
                      {customer.name}
                    </div>
                  </div>
                  {customer.company && (
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <IconBuilding className="size-4" />
                        {customer.company}
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="flex items-center gap-2 text-sm">
                      <IconMail className="size-4" />
                      {customer.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <div className="flex items-center gap-2 text-sm">
                      <IconPhone className="size-4" />
                      {customer.phone}
                    </div>
                  </div>
                  {customer.address && (
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Address</Label>
                      <div className="flex items-center gap-2 text-sm">
                        <IconMapPin className="size-4" />
                        {customer.address}
                      </div>
                    </div>
                  )}
                  {customer.preferredPaymentMethod && (
                    <div className="space-y-2">
                      <Label>Preferred Payment Method</Label>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <IconCurrencyDollar className="size-4" />
                        {customer.preferredPaymentMethod}
                      </div>
                    </div>
                  )}
                  {customer.billingInfo && (
                    <div className="space-y-2">
                      <Label>Billing Info</Label>
                      <div className="text-sm">{customer.billingInfo}</div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Customer Since</Label>
                    <div className="flex items-center gap-2 text-sm">
                      <IconCalendar className="size-4" />
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {customer.lastActivity && (
                    <div className="space-y-2">
                      <Label>Last Activity</Label>
                      <div className="flex items-center gap-2 text-sm">
                        <IconCalendar className="size-4" />
                        {new Date(customer.lastActivity).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
                {customer.notes && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <div className="flex items-start gap-2 text-sm">
                        <IconNotes className="mt-1 size-4" />
                        <div className="flex-1">{customer.notes}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              {customerStats && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 rounded-lg border p-4">
                      <Label>Active Rentals</Label>
                      <div className="text-2xl font-semibold">
                        {customerStats.activeRentals}
                      </div>
                    </div>
                    <div className="space-y-2 rounded-lg border p-4">
                      <Label>Total Rentals</Label>
                      <div className="text-2xl font-semibold">
                        {customerStats.totalRentals}
                      </div>
                    </div>
                    <div className="space-y-2 rounded-lg border p-4">
                      <Label>Outstanding Balance</Label>
                      <div
                        className={cn(
                          "text-2xl font-semibold",
                          customerStats.outstandingBalance > 0 &&
                            "text-red-600 dark:text-red-400"
                        )}
                      >
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(customerStats.outstandingBalance)}
                      </div>
                    </div>
                    <div className="space-y-2 rounded-lg border p-4">
                      <Label>Total Spent</Label>
                      <div className="text-2xl font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(customerStats.totalSpent)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rentals" className="space-y-4">
              <div className="space-y-4">
                {activeRentals.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Active Rentals</Label>
                    <div className="space-y-2">
                      {activeRentals.map((rental) => (
                        <div
                          key={rental.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div>
                            <div className="font-medium">{rental.equipmentName}</div>
                            <div className="text-xs text-muted-foreground">
                              Due: {new Date(rental.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge variant="outline">{rental.id}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Separator />
                <div>
                  <Label className="mb-2 block">Rental History</Label>
                  <div className="space-y-2">
                    {rentalHistory.length > 0 ? (
                      rentalHistory.map((rental) => (
                        <div
                          key={rental.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div>
                            <div className="font-medium">{rental.equipmentName}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(rental.startDate).toLocaleDateString()} -{" "}
                              {rental.returnDate
                                ? new Date(rental.returnDate).toLocaleDateString()
                                : "Active"}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(rental.totalCost)}
                            </div>
                            <Badge
                              variant="outline"
                              className="mt-1 text-xs"
                            >
                              {rental.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No rental history
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DrawerFooter>
          <div className="flex flex-col gap-2 sm:flex-row">
            {onNewRental && (
              <Button
                variant="default"
                onClick={() => onNewRental?.(customer)}
                className="flex-1"
              >
                <IconPlus className="mr-2 size-4" />
                New Rental
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                onClick={() => onEdit?.(customer)}
                className="flex-1"
              >
                <IconEdit className="mr-2 size-4" />
                Edit Customer
              </Button>
            )}
            {customer.status === "active" && onDeactivate && (
              <Button
                variant="outline"
                onClick={() => onDeactivate?.(customer)}
                className="flex-1"
              >
                <IconX className="mr-2 size-4" />
                Deactivate
              </Button>
            )}
            {customerStats?.outstandingBalance > 0 && onSendReminder && (
              <Button
                variant="outline"
                onClick={() => onSendReminder?.(customer)}
              >
                Send Reminder
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

