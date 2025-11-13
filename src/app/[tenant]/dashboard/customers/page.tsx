"use client"

import * as React from "react"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { CustomersKPICards } from "@/components/customers/customers-kpi-cards"
import { CustomersTable } from "@/components/customers/customers-table"
import {
  CustomersFilters,
  type CustomersFilters as CustomersFiltersType,
} from "@/components/customers/customers-filters"
import { CustomerDetailDrawer } from "@/components/customers/customer-detail-drawer"
import { NewCustomerDrawer } from "@/components/customers/new-customer-drawer"
import { mockCustomersExtended } from "@/data/mock-customers-extended"
import { mockRentals } from "@/data/mock-rentals"
import { Customer, CustomerStats } from "@/types/customer"
import { Rental } from "@/types/rental"
import { toast } from "sonner"

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<Customer[]>(mockCustomersExtended)
  const [rentals] = React.useState<Rental[]>(mockRentals)
  const [filteredCustomers, setFilteredCustomers] = React.useState<Customer[]>(
    mockCustomersExtended
  )
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null)
  const [selectedCustomerStats, setSelectedCustomerStats] = React.useState<CustomerStats | null>(
    null
  )
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [newCustomerOpen, setNewCustomerOpen] = React.useState(false)
  const [editMode, setEditMode] = React.useState(false)
  const [filters, setFilters] = React.useState<CustomersFiltersType>({
    status: null,
    type: null,
    sort: null,
    search: "",
  })

  // Calculate customer stats
  const customerStats = React.useMemo<CustomerStats[]>(() => {
    return customers.map((customer) => {
      const customerRentals = rentals.filter((r) => r.customerId === customer.id)
      const activeRentals = customerRentals.filter(
        (r) => r.status === "active" || r.status === "due_soon"
      ).length
      const totalRentals = customerRentals.length
      const outstandingBalance = customerRentals
        .filter((r) => r.paymentStatus === "pending" || r.paymentStatus === "partial")
        .reduce((sum, r) => {
          if (r.paymentStatus === "paid") return sum
          if (r.paymentStatus === "partial") return sum + (r.totalCost - r.deposit)
          return sum + r.totalCost
        }, 0)
      const totalSpent = customerRentals
        .filter((r) => r.paymentStatus === "paid")
        .reduce((sum, r) => sum + r.totalCost, 0)
      const averageRentalValue =
        totalRentals > 0 ? totalSpent / totalRentals : 0

      return {
        customerId: customer.id,
        activeRentals,
        totalRentals,
        outstandingBalance,
        totalSpent,
        averageRentalValue,
      }
    })
  }, [customers, rentals])

  // Apply filters and sorting
  React.useEffect(() => {
    let filtered = [...customers]

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((c) => c.status === filters.status)
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter((c) => c.type === filters.type)
    }

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          (c.company?.toLowerCase().includes(search) || false) ||
          c.email.toLowerCase().includes(search) ||
          c.phone.toLowerCase().includes(search)
      )
    }

    // Sort
    if (filters.sort) {
      filtered.sort((a, b) => {
        const statsA = customerStats.find((s) => s.customerId === a.id)
        const statsB = customerStats.find((s) => s.customerId === b.id)
        switch (filters.sort) {
          case "name":
            return a.name.localeCompare(b.name)
          case "balance":
            return (statsB?.outstandingBalance || 0) - (statsA?.outstandingBalance || 0)
          case "balance_low":
            return (statsA?.outstandingBalance || 0) - (statsB?.outstandingBalance || 0)
          case "rentals":
            return (statsB?.totalRentals || 0) - (statsA?.totalRentals || 0)
          default:
            return 0
        }
      })
    } else {
      // Default: sort by last activity
      filtered.sort((a, b) => {
        if (!a.lastActivity && !b.lastActivity) return 0
        if (!a.lastActivity) return 1
        if (!b.lastActivity) return -1
        return (
          new Date(b.lastActivity!).getTime() - new Date(a.lastActivity!).getTime()
        )
      })
    }

    setFilteredCustomers(filtered)
  }, [customers, filters, customerStats])

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer)
    const stats = customerStats.find((s) => s.customerId === customer.id) || null
    setSelectedCustomerStats(stats)
    setDrawerOpen(true)
  }

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setEditMode(true)
    setNewCustomerOpen(true)
  }

  const handleDelete = (customer: Customer) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customer.id))
    toast.success(`${customer.name} deleted successfully`)
  }

  const handleAdd = () => {
    setSelectedCustomer(null)
    setEditMode(false)
    setNewCustomerOpen(true)
  }

  const handleSave = (customerData: Omit<Customer, "id">) => {
    if (editMode && selectedCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedCustomer.id
            ? { ...c, ...customerData, id: selectedCustomer.id }
            : c
        )
      )
      toast.success(`${customerData.name} updated successfully`)
    } else {
      const newCustomer: Customer = {
        ...customerData,
        id: `CUST-${String(customers.length + 1).padStart(3, "0")}`,
      }
      setCustomers((prev) => [...prev, newCustomer])
      toast.success(`${customerData.name} added successfully`)
    }
    setNewCustomerOpen(false)
    setSelectedCustomer(null)
    setEditMode(false)
  }

  const handleDeactivate = (customer: Customer) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customer.id ? { ...c, status: "inactive" as const } : c
      )
    )
    toast.success(`${customer.name} deactivated`)
    setDrawerOpen(false)
  }

  const handleSendReminder = (customer: Customer) => {
    toast.success(`Reminder sent to ${customer.name}`)
  }

  const handleNewRental = (customer: Customer) => {
    // Navigate to rentals page with customer pre-selected
    toast.info(`Navigate to rentals page for ${customer.name}`)
    setDrawerOpen(false)
  }

  return (
    <SidebarInset>
      <SiteHeader title="Customers" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* KPI Cards */}
            <CustomersKPICards
              customers={customers}
              customerStats={customerStats}
            />

            {/* Filters */}
            <div className="px-4 lg:px-6">
              <CustomersFilters onFilterChange={setFilters} />
            </div>

            {/* Customers Table */}
            <CustomersTable
              data={filteredCustomers}
              customerStats={customerStats}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
              search={filters.search}
            />
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <CustomerDetailDrawer
        customer={selectedCustomer}
        customerStats={selectedCustomerStats}
        rentals={rentals}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onEdit={handleEdit}
        onNewRental={handleNewRental}
        onDeactivate={handleDeactivate}
        onSendReminder={handleSendReminder}
      />

      {/* New/Edit Customer Drawer */}
      <NewCustomerDrawer
        open={newCustomerOpen}
        onOpenChange={setNewCustomerOpen}
        onSave={handleSave}
        mode={editMode ? "edit" : "create"}
        customer={selectedCustomer}
      />
    </SidebarInset>
  )
}

