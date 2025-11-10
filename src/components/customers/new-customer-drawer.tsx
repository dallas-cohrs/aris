"use client"

import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { IconMail, IconPhone, IconMapPin, IconNotes } from "@tabler/icons-react"

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
import { Customer, CustomerStatus, CustomerType } from "@/types/customer"

interface NewCustomerDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (customer: Omit<Customer, "id">) => void
  mode?: "create" | "edit"
  customer?: Customer | null
}

export function NewCustomerDrawer({
  open,
  onOpenChange,
  onSave,
  mode = "create",
  customer,
}: NewCustomerDrawerProps) {
  const isMobile = useIsMobile()
  const [formData, setFormData] = React.useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    status: "active" as CustomerStatus,
    type: "company" as CustomerType,
    notes: "",
    preferredPaymentMethod: "",
    billingInfo: "",
  })

  React.useEffect(() => {
    if (customer && mode === "edit") {
      setFormData({
        name: customer.name,
        company: customer.company || "",
        email: customer.email,
        phone: customer.phone,
        address: customer.address || "",
        status: customer.status,
        type: customer.type,
        notes: customer.notes || "",
        preferredPaymentMethod: customer.preferredPaymentMethod || "",
        billingInfo: customer.billingInfo || "",
      })
    } else {
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        address: "",
        status: "active",
        type: "company",
        notes: "",
        preferredPaymentMethod: "",
        billingInfo: "",
      })
    }
  }, [customer, mode, open])

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      return
    }

    const newCustomer: Omit<Customer, "id"> = {
      name: formData.name,
      company: formData.company || null,
      email: formData.email,
      phone: formData.phone,
      address: formData.address || null,
      status: formData.status,
      type: formData.type,
      notes: formData.notes || null,
      preferredPaymentMethod: formData.preferredPaymentMethod || null,
      billingInfo: formData.billingInfo || null,
      createdAt: customer?.createdAt || new Date().toISOString().split("T")[0],
      lastActivity: null,
    }

    onSave(newCustomer)
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent className="max-h-[96vh]">
        <DrawerHeader>
          <DrawerTitle>{mode === "edit" ? "Edit Customer" : "New Customer"}</DrawerTitle>
          <DrawerDescription>
            {mode === "edit"
              ? "Update customer information"
              : "Add a new customer to the system"}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as CustomerType })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.type === "company" && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="Company Name"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <IconMail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <div className="relative">
                  <IconPhone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="(555) 123-4567"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <IconMapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="123 Main St, City, State ZIP"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as CustomerStatus })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredPaymentMethod">Preferred Payment Method</Label>
                <Select
                  value={formData.preferredPaymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, preferredPaymentMethod: value })
                  }
                >
                  <SelectTrigger id="preferredPaymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="billingInfo">Billing Info</Label>
                <Input
                  id="billingInfo"
                  value={formData.billingInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, billingInfo: e.target.value })
                  }
                  placeholder="Billing address or info"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <div className="relative">
                  <IconNotes className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={4}
                    placeholder="Add any notes about this customer..."
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button
            onClick={handleSave}
            disabled={!formData.name || !formData.email || !formData.phone}
          >
            {mode === "edit" ? "Save Changes" : "Create Customer"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

