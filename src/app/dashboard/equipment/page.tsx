"use client"

import * as React from "react"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { EquipmentKPICards } from "@/components/equipment-kpi-cards"
import { EquipmentTable } from "@/components/equipment-table"
import { EquipmentFilters, type EquipmentFilters as EquipmentFiltersType } from "@/components/equipment-filters"
import { EquipmentDetailDrawer } from "@/components/equipment-detail-drawer"
import { mockEquipment } from "@/data/mock-equipment"
import { Equipment } from "@/types/equipment"
import { toast } from "sonner"

export default function EquipmentPage() {
  const [equipment, setEquipment] = React.useState<Equipment[]>(mockEquipment)
  const [filteredEquipment, setFilteredEquipment] = React.useState<Equipment[]>(mockEquipment)
  const [selectedEquipment, setSelectedEquipment] = React.useState<Equipment | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<"view" | "edit">("view")
  const [filters, setFilters] = React.useState<EquipmentFiltersType>({
    type: null,
    status: null,
    location: null,
    condition: null,
  })

  // Get unique locations for filter dropdown
  const locations = React.useMemo(
    () => Array.from(new Set(equipment.map((eq) => eq.location))).sort(),
    [equipment]
  )

  // Apply filters
  React.useEffect(() => {
    let filtered = [...equipment]

    if (filters.type) {
      filtered = filtered.filter((eq) => eq.type === filters.type)
    }
    if (filters.status) {
      filtered = filtered.filter((eq) => eq.status === filters.status)
    }
    if (filters.location) {
      filtered = filtered.filter((eq) => eq.location === filters.location)
    }
    if (filters.condition) {
      filtered = filtered.filter((eq) => eq.condition === filters.condition)
    }

    setFilteredEquipment(filtered)
  }, [equipment, filters])

  const handleView = (eq: Equipment) => {
    setSelectedEquipment(eq)
    setDrawerMode("view")
    setDrawerOpen(true)
  }

  const handleEdit = (eq: Equipment) => {
    setSelectedEquipment(eq)
    setDrawerMode("edit")
    setDrawerOpen(true)
  }

  const handleDelete = (eq: Equipment) => {
    setEquipment((prev) => prev.filter((e) => e.id !== eq.id))
    toast.success(`${eq.name} deleted successfully`)
  }

  const handleAdd = () => {
    const newEquipment: Equipment = {
      id: `EQ-${String(equipment.length + 1).padStart(3, "0")}`,
      name: "New Equipment",
      type: "Other",
      condition: "good",
      status: "available",
      location: "Denver Yard",
      ratePerDay: 0,
      utilization: 0,
      serialNumber: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      lastMaintenanceDate: null,
      nextMaintenanceDate: null,
      assignedRenter: null,
      notes: null,
      photoUrl: null,
    }
    setSelectedEquipment(newEquipment)
    setDrawerMode("edit")
    setDrawerOpen(true)
  }

  const handleSave = (eq: Equipment) => {
    const existingIndex = equipment.findIndex((e) => e.id === eq.id)
    if (existingIndex >= 0) {
      setEquipment((prev) => {
        const updated = [...prev]
        updated[existingIndex] = eq
        return updated
      })
      toast.success(`${eq.name} updated successfully`)
    } else {
      setEquipment((prev) => [...prev, eq])
      toast.success(`${eq.name} added successfully`)
    }
    setDrawerOpen(false)
  }

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    setEquipment((prev) => {
      if (action === "Delete") {
        return prev.filter((e) => !selectedIds.includes(e.id))
      } else if (action === "Mark as Available") {
        return prev.map((e) =>
          selectedIds.includes(e.id) ? { ...e, status: "available" as const } : e
        )
      } else if (action === "Mark as Maintenance") {
        return prev.map((e) =>
          selectedIds.includes(e.id) ? { ...e, status: "maintenance" as const } : e
        )
      }
      return prev
    })
  }

  return (
    <SidebarInset>
      <SiteHeader title="Equipment" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* KPI Cards */}
            <EquipmentKPICards equipment={equipment} />

            {/* Filters */}
            <div className="px-4 lg:px-6">
              <EquipmentFilters
                onFilterChange={setFilters}
                locations={locations}
              />
            </div>

            {/* Equipment Table */}
            <EquipmentTable
              data={filteredEquipment}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
              onBulkAction={handleBulkAction}
            />
          </div>
        </div>
      </div>

      {/* Detail/Edit Drawer */}
      <EquipmentDetailDrawer
        equipment={selectedEquipment}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
        onSave={handleSave}
      />
    </SidebarInset>
  )
}
