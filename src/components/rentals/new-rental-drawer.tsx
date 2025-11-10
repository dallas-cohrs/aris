"use client"

import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { IconCalendar, IconCurrencyDollar, IconNotes } from "@tabler/icons-react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Rental } from "@/types/rental"
import { Equipment } from "@/types/equipment"

interface NewRentalDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (rental: Omit<Rental, "id">) => void
  equipment: Equipment[]
  customers: Array<{ id: string; name: string; company: string | null }>
}

export function NewRentalDrawer({
  open,
  onOpenChange,
  onSave,
  equipment,
  customers,
}: NewRentalDrawerProps) {
  const isMobile = useIsMobile()
  const [formData, setFormData] = React.useState({
    equipmentId: "",
    customerId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    deposit: 0,
    notes: "",
  })

  const selectedEquipment = equipment.find((e) => e.id === formData.equipmentId)
  const selectedCustomer = customers.find((c) => c.id === formData.customerId)

  // Calculate total cost
  const calculateTotal = () => {
    if (!selectedEquipment || !formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return days * selectedEquipment.ratePerDay
  }

  const totalDays = React.useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }, [formData.startDate, formData.endDate])

  const estimatedTotal = React.useMemo(() => {
    if (!selectedEquipment) return 0
    return totalDays * selectedEquipment.ratePerDay
  }, [selectedEquipment, totalDays])

  const handleSave = () => {
    if (!selectedEquipment || !selectedCustomer) {
      return
    }

    const newRental: Omit<Rental, "id"> = {
      equipmentId: formData.equipmentId,
      equipmentName: selectedEquipment.name,
      equipmentType: selectedEquipment.type,
      equipmentSerialNumber: selectedEquipment.serialNumber,
      customerId: formData.customerId,
      customerName: selectedCustomer.name,
      customerCompany: selectedCustomer.company,
      startDate: formData.startDate,
      dueDate: formData.endDate,
      returnDate: null,
      status: "active",
      ratePerDay: selectedEquipment.ratePerDay,
      totalDays: totalDays,
      totalCost: estimatedTotal,
      deposit: formData.deposit,
      paymentStatus: "pending",
      paymentMethod: null,
      notes: formData.notes || null,
      returnedWithDamage: false,
      damageNotes: null,
    }

    onSave(newRental)
    // Reset form
    setFormData({
      equipmentId: "",
      customerId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      deposit: 0,
      notes: "",
    })
    onOpenChange(false)
  }

  const availableEquipment = equipment.filter((e) => e.status === "available")

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent className="max-h-[96vh]">
        <DrawerHeader>
          <DrawerTitle>New Rental</DrawerTitle>
          <DrawerDescription>
            Create a new equipment rental for a customer
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Select
                value={formData.customerId}
                onValueChange={(value) =>
                  setFormData({ ...formData, customerId: value })
                }
              >
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.company || customer.name}
                      {customer.company && ` (${customer.name})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment">Equipment *</Label>
              <Select
                value={formData.equipmentId}
                onValueChange={(value) =>
                  setFormData({ ...formData, equipmentId: value })
                }
              >
                <SelectTrigger id="equipment">
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {availableEquipment.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No available equipment
                    </SelectItem>
                  ) : (
                    availableEquipment.map((eq) => (
                      <SelectItem key={eq.id} value={eq.id}>
                        {eq.name} - {eq.type} ({eq.ratePerDay}/day)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedEquipment && (
                <div className="text-xs text-muted-foreground">
                  Rate: {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(selectedEquipment.ratePerDay)}/day
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  min={formData.startDate || new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="space-y-2">
                <Label>Rental Duration</Label>
                <div className="text-sm font-medium">
                  {totalDays} day{totalDays !== 1 ? "s" : ""}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="deposit">Deposit (Optional)</Label>
              <div className="relative">
                <IconCurrencyDollar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="deposit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deposit || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deposit: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="pl-9"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                placeholder="Add any notes about this rental..."
              />
            </div>

            <Separator />

            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Label>Estimated Total</Label>
                <div className="text-lg font-semibold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(estimatedTotal)}
                </div>
              </div>
              {selectedEquipment && formData.startDate && formData.endDate && (
                <div className="text-xs text-muted-foreground">
                  {totalDays} days ×{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(selectedEquipment.ratePerDay)}
                  /day
                </div>
              )}
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button
            onClick={handleSave}
            disabled={
              !formData.equipmentId ||
              !formData.customerId ||
              !formData.startDate ||
              !formData.endDate
            }
          >
            Create Rental
          </Button>
          <DrawerClose asChild>
            <Button
              variant="outline"
              onClick={() => {
                setFormData({
                  equipmentId: "",
                  customerId: "",
                  startDate: new Date().toISOString().split("T")[0],
                  endDate: "",
                  deposit: 0,
                  notes: "",
                })
              }}
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

