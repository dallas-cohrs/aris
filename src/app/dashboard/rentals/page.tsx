"use client"

import * as React from "react"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { RentalsKPICards } from "@/components/rentals/rentals-kpi-cards"
import { RentalsTable } from "@/components/rentals/rentals-table"
import {
  RentalsFilters,
  type RentalsFilters as RentalsFiltersType,
} from "@/components/rentals/rentals-filters"
import { RentalDetailDrawer } from "@/components/rentals/rental-detail-drawer"
import { NewRentalDrawer } from "@/components/rentals/new-rental-drawer"
import { mockRentals } from "@/data/mock-rentals"
import { mockEquipment } from "@/data/mock-equipment"
import { mockCustomers } from "@/data/mock-customers"
import { Rental } from "@/types/rental"
import { Equipment } from "@/types/equipment"
import { toast } from "sonner"

export default function RentalsPage() {
  const [rentals, setRentals] = React.useState<Rental[]>(mockRentals)
  const [equipment] = React.useState<Equipment[]>(mockEquipment)
  const [customers] = React.useState(mockCustomers)
  const [filteredRentals, setFilteredRentals] = React.useState<Rental[]>(mockRentals)
  const [selectedRental, setSelectedRental] = React.useState<Rental | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [newRentalOpen, setNewRentalOpen] = React.useState(false)
  const [filters, setFilters] = React.useState<RentalsFiltersType>({
    status: null,
    customer: null,
    equipmentType: null,
    dateRange: null,
    search: "",
  })

  // Get unique values for filters
  const customerNames = React.useMemo(
    () =>
      Array.from(
        new Set(
          rentals.map((r) => r.customerCompany || r.customerName)
        )
      ).sort(),
    [rentals]
  )

  const equipmentTypes = React.useMemo(
    () =>
      Array.from(new Set(rentals.map((r) => r.equipmentType))).sort(),
    [rentals]
  )

  // Apply filters
  React.useEffect(() => {
    let filtered = [...rentals]

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((r) => r.status === filters.status)
    }

    // Customer filter
    if (filters.customer) {
      filtered = filtered.filter(
        (r) =>
          r.customerCompany === filters.customer ||
          r.customerName === filters.customer
      )
    }

    // Equipment type filter
    if (filters.equipmentType) {
      filtered = filtered.filter((r) => r.equipmentType === filters.equipmentType)
    }

    // Date range filter
    if (filters.dateRange) {
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const startOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      )
      const endOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      )
      const startOfQuarter = new Date(
        today.getFullYear(),
        Math.floor(today.getMonth() / 3) * 3,
        1
      )

      filtered = filtered.filter((r) => {
        const rentalDate = new Date(r.startDate)
        switch (filters.dateRange) {
          case "this_week":
            return rentalDate >= startOfWeek
          case "this_month":
            return rentalDate >= startOfMonth
          case "last_month":
            return rentalDate >= startOfLastMonth && rentalDate <= endOfLastMonth
          case "this_quarter":
            return rentalDate >= startOfQuarter
          default:
            return true
        }
      })
    }

    // Search filter (handled by table component)
    setFilteredRentals(filtered)
  }, [rentals, filters])

  const handleView = (rental: Rental) => {
    setSelectedRental(rental)
    setDrawerOpen(true)
  }

  const handleReturn = (rental: Rental) => {
    const returnDate = new Date().toISOString().split("T")[0]
    setRentals((prev) =>
      prev.map((r) =>
        r.id === rental.id
          ? { ...r, status: "returned" as const, returnDate }
          : r
      )
    )
    toast.success(`${rental.equipmentName} marked as returned`)
    setDrawerOpen(false)
  }

  const handleExtend = (rental: Rental) => {
    // In a real app, this would open a date picker
    const newDueDate = new Date(rental.dueDate)
    newDueDate.setDate(newDueDate.getDate() + 7)
    const newTotalDays = Math.ceil(
      (newDueDate.getTime() - new Date(rental.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
    const newTotalCost = newTotalDays * rental.ratePerDay

    setRentals((prev) =>
      prev.map((r) =>
        r.id === rental.id
          ? {
              ...r,
              dueDate: newDueDate.toISOString().split("T")[0],
              totalDays: newTotalDays,
              totalCost: newTotalCost,
            }
          : r
      )
    )
    toast.success(`${rental.equipmentName} rental extended by 7 days`)
    setDrawerOpen(false)
  }

  const handleGenerateInvoice = (rental: Rental) => {
    toast.success(`Invoice generated for ${rental.id}`)
    // In a real app, this would generate and download a PDF
  }

  const handleAdd = () => {
    setNewRentalOpen(true)
  }

  const handleSaveNewRental = (rentalData: Omit<Rental, "id">) => {
    const newRental: Rental = {
      ...rentalData,
      id: `RNT-${String(rentals.length + 1).padStart(3, "0")}`,
    }
    setRentals((prev) => [...prev, newRental])
    
    // Update equipment status
    const equipmentToUpdate = equipment.find((e) => e.id === rentalData.equipmentId)
    if (equipmentToUpdate) {
      // In a real app, you'd update the equipment status here
      toast.success(`Rental ${newRental.id} created successfully`)
    }
  }

  const handleKpiCardClick = (filter: string) => {
    setFilters((prev) => ({
      ...prev,
      status: filter === "active" ? "active" : filter === "due_soon" ? "due_soon" : filter === "overdue" ? "overdue" : null,
    }))
  }

  return (
    <SidebarInset>
      <SiteHeader title="Rentals" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* KPI Cards */}
            <RentalsKPICards
              rentals={rentals}
              onCardClick={handleKpiCardClick}
            />

            {/* Filters */}
            <div className="px-4 lg:px-6">
              <RentalsFilters
                onFilterChange={setFilters}
                customers={customerNames}
                equipmentTypes={equipmentTypes}
              />
            </div>

            {/* Rentals Table */}
            <RentalsTable
              data={filteredRentals}
              onView={handleView}
              onReturn={handleReturn}
              onExtend={handleExtend}
              onAdd={handleAdd}
              search={filters.search}
            />
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <RentalDetailDrawer
        rental={selectedRental}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onReturn={handleReturn}
        onExtend={handleExtend}
        onGenerateInvoice={handleGenerateInvoice}
      />

      {/* New Rental Drawer */}
      <NewRentalDrawer
        open={newRentalOpen}
        onOpenChange={setNewRentalOpen}
        onSave={handleSaveNewRental}
        equipment={equipment}
        customers={customers}
      />
    </SidebarInset>
  )
}
