// app/(dashboard)/tenant/[slug]/equipment/equipment-client.tsx
"use client"

import * as React from "react"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { EquipmentKPICards } from "@/components/equipment/equipment-kpi-cards"
import { EquipmentTable } from "@/components/equipment/equipment-table"
import { EquipmentFilters, type EquipmentFilters as EquipmentFiltersType } from "@/components/equipment/equipment-filters"
import { EquipmentDetailDrawer } from "@/components/equipment/equipment-detail-drawer"
import { Equipment } from "@/types/equipment"
import { toast } from "sonner"

export default function EquipmentPageClient({ equipment: initialEquipment }: { equipment: Equipment[] }) {
  const [equipment, setEquipment] = React.useState(initialEquipment)
  const [filteredEquipment, setFilteredEquipment] = React.useState(equipment)
  const [selectedEquipment, setSelectedEquipment] = React.useState<Equipment | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<"view" | "edit">("view")
  const [filters, setFilters] = React.useState<EquipmentFiltersType>({
    type: null,
    status: null,
    location: null,
    condition: null,
  })

  // Filter logic (same as before)
  React.useEffect(() => {
    let filtered = [...equipment]

    if (filters.type) filtered = filtered.filter((eq) => eq.type === filters.type)
    if (filters.status) filtered = filtered.filter((eq) => eq.status === filters.status)
    if (filters.location) filtered = filtered.filter((eq) => eq.location === filters.location)
    if (filters.condition) filtered = filtered.filter((eq) => eq.condition === filters.condition)

    setFilteredEquipment(filtered)
  }, [equipment, filters])

  // handleView, handleEdit, handleSave etc. stay the same

  return (
    <SidebarInset>
      <SiteHeader title="Equipment" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <EquipmentKPICards equipment={equipment} />
            <div className="px-4 lg:px-6">
              <EquipmentFilters onFilterChange={setFilters} locations={Array.from(new Set(equipment.map((e) => e.location)))} />
            </div>
            <EquipmentTable
              data={filteredEquipment}
              onView={setSelectedEquipment}
              onEdit={setSelectedEquipment}
              onDelete={() => {}}
              onAdd={() => {}}
              onBulkAction={() => {}}
            />
          </div>
        </div>
      </div>

      <EquipmentDetailDrawer
        equipment={selectedEquipment}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
        onSave={() => {}}
      />
    </SidebarInset>
  )
}
