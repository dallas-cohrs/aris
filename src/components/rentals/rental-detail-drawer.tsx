"use client"

import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  IconEdit,
  IconCalendar,
  IconCurrencyDollar,
  IconNotes,
  IconCheck,
  IconClock,
  IconFileInvoice,
  IconUser,
  IconPackage,
} from "@tabler/icons-react"

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
import { Rental, RentalStatus } from "@/types/rental"
import { cn } from "@/lib/utils"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface RentalDetailDrawerProps {
  rental: Rental | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onReturn?: (rental: Rental) => void
  onExtend?: (rental: Rental) => void
  onGenerateInvoice?: (rental: Rental) => void
}

const statusColors: Record<RentalStatus, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  due_soon: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  returned: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
}

const statusIcons: Record<RentalStatus, string> = {
  active: "🟢",
  overdue: "🔴",
  due_soon: "🟡",
  returned: "⚪",
}

const statusLabels: Record<RentalStatus, string> = {
  active: "Active",
  overdue: "Overdue",
  due_soon: "Due Soon",
  returned: "Returned",
}

export function RentalDetailDrawer({
  rental,
  open,
  onOpenChange,
  onReturn,
  onExtend,
  onGenerateInvoice,
}: RentalDetailDrawerProps) {
  const isMobile = useIsMobile()

  if (!rental) return null

  const startDate = new Date(rental.startDate)
  const dueDate = new Date(rental.dueDate)
  const returnDate = rental.returnDate ? new Date(rental.returnDate) : null
  const today = new Date()
  
  // Calculate progress
  const totalDays = Math.ceil(
    (dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const elapsedDays = Math.ceil(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const progress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100)

  const getDaysRemaining = () => {
    if (rental.status === "returned") return 0
    const diff = dueDate.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const daysRemaining = getDaysRemaining()

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent className="max-h-[96vh]">
        <DrawerHeader className="gap-1">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle>{rental.equipmentName}</DrawerTitle>
              <DrawerDescription>
                {rental.id} • {rental.equipmentType}
              </DrawerDescription>
            </div>
            <Badge
              variant="outline"
              className={cn("capitalize", statusColors[rental.status])}
            >
              {statusIcons[rental.status]} {statusLabels[rental.status]}
            </Badge>
          </div>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {/* Progress Bar */}
          {rental.status !== "returned" && (
            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Rental Progress</span>
                <span className="text-muted-foreground">
                  {daysRemaining > 0
                    ? `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining`
                    : "Overdue"}
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    rental.status === "overdue"
                      ? "bg-red-500"
                      : rental.status === "due_soon"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {elapsedDays} of {totalDays} days elapsed
              </div>
            </div>
          )}

          <Tabs defaultValue="rental" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="rental">Rental</TabsTrigger>
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="rental" className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Rental ID</Label>
                    <div className="text-sm font-medium">{rental.id}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Badge
                      variant="outline"
                      className={cn("capitalize", statusColors[rental.status])}
                    >
                      {statusIcons[rental.status]} {statusLabels[rental.status]}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <div className="flex items-center gap-2 text-sm">
                      <IconCalendar className="size-4" />
                      {startDate.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <div className="flex items-center gap-2 text-sm">
                      <IconCalendar className="size-4" />
                      {dueDate.toLocaleDateString()}
                    </div>
                  </div>
                  {returnDate && (
                    <div className="space-y-2">
                      <Label>Return Date</Label>
                      <div className="flex items-center gap-2 text-sm">
                        <IconCalendar className="size-4" />
                        {returnDate.toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Total Days</Label>
                    <div className="text-sm font-medium">{rental.totalDays} days</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Rate per Day</Label>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <IconCurrencyDollar className="size-4" />
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(rental.ratePerDay)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Total Cost</Label>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <IconCurrencyDollar className="size-4" />
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(rental.totalCost)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Deposit</Label>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <IconCurrencyDollar className="size-4" />
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(rental.deposit)}
                    </div>
                  </div>
                </div>
                {rental.notes && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <div className="flex items-start gap-2 text-sm">
                        <IconNotes className="mt-1 size-4" />
                        <div className="flex-1">{rental.notes}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="customer" className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Customer Name</Label>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <IconUser className="size-4" />
                      {rental.customerName}
                    </div>
                  </div>
                  {rental.customerCompany && (
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <div className="text-sm font-medium">
                        {rental.customerCompany}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="equipment" className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Equipment Name</Label>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <IconPackage className="size-4" />
                      {rental.equipmentName}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Equipment Type</Label>
                    <div className="text-sm font-medium">{rental.equipmentType}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Serial Number</Label>
                    <div className="text-sm font-medium">
                      {rental.equipmentSerialNumber}
                    </div>
                  </div>
                </div>
                {rental.returnedWithDamage && rental.damageNotes && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="text-destructive">Damage Report</Label>
                      <div className="text-sm">{rental.damageNotes}</div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Payment Status</Label>
                    <Badge
                      variant={
                        rental.paymentStatus === "paid"
                          ? "default"
                          : rental.paymentStatus === "partial"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {rental.paymentStatus === "paid"
                        ? "Paid"
                        : rental.paymentStatus === "partial"
                        ? "Partial"
                        : "Pending"}
                    </Badge>
                  </div>
                  {rental.paymentMethod && (
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <div className="text-sm font-medium">
                        {rental.paymentMethod}
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Total Cost</Label>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <IconCurrencyDollar className="size-4" />
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(rental.totalCost)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Deposit</Label>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <IconCurrencyDollar className="size-4" />
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(rental.deposit)}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DrawerFooter>
          {rental.status !== "returned" ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="default"
                onClick={() => onReturn?.(rental)}
                className="flex-1"
              >
                <IconCheck className="mr-2 size-4" />
                Mark Returned
              </Button>
              <Button
                variant="outline"
                onClick={() => onExtend?.(rental)}
                className="flex-1"
              >
                <IconClock className="mr-2 size-4" />
                Extend Rental
              </Button>
              <Button
                variant="outline"
                onClick={() => onGenerateInvoice?.(rental)}
              >
                <IconFileInvoice className="mr-2 size-4" />
                Generate Invoice
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => onGenerateInvoice?.(rental)}
                className="flex-1"
              >
                <IconFileInvoice className="mr-2 size-4" />
                Generate Invoice
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1">Close</Button>
              </DrawerClose>
            </div>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

