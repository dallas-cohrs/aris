"use client"

import * as React from "react"
import { IconFilter, IconX } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { EquipmentType, EquipmentStatus, EquipmentCondition } from "@/types/equipment"

interface EquipmentFiltersProps {
  onFilterChange: (filters: EquipmentFilters) => void
  locations: string[]
}

export interface EquipmentFilters {
  type: string | null
  status: string | null
  location: string | null
  condition: string | null
}

export function EquipmentFilters({
  onFilterChange,
  locations,
}: EquipmentFiltersProps) {
  const [filters, setFilters] = React.useState<EquipmentFilters>({
    type: null,
    status: null,
    location: null,
    condition: null,
  })

  const updateFilter = (key: keyof EquipmentFilters, value: string | null) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: EquipmentFilters = {
      type: null,
      status: null,
      location: null,
      condition: null,
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== null)

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconFilter className="size-4" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2"
          >
            <IconX className="mr-1 size-3" />
            Clear
          </Button>
        )}
      </div>
      <Separator />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="filter-type">Category</Label>
          <Select
            value={filters.type || ""}
            onValueChange={(value) =>
              updateFilter("type", value === "all" ? null : value)
            }
          >
            <SelectTrigger id="filter-type">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Excavator">Excavator</SelectItem>
              <SelectItem value="Loader">Loader</SelectItem>
              <SelectItem value="Generator">Generator</SelectItem>
              <SelectItem value="Compactor">Compactor</SelectItem>
              <SelectItem value="Dozer">Dozer</SelectItem>
              <SelectItem value="Crane">Crane</SelectItem>
              <SelectItem value="Forklift">Forklift</SelectItem>
              <SelectItem value="Scaffolding">Scaffolding</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="filter-status">Status</Label>
          <Select
            value={filters.status || ""}
            onValueChange={(value) =>
              updateFilter("status", value === "all" ? null : value)
            }
          >
            <SelectTrigger id="filter-status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="filter-location">Location</Label>
          <Select
            value={filters.location || ""}
            onValueChange={(value) =>
              updateFilter("location", value === "all" ? null : value)
            }
          >
            <SelectTrigger id="filter-location">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="filter-condition">Condition</Label>
          <Select
            value={filters.condition || ""}
            onValueChange={(value) =>
              updateFilter("condition", value === "all" ? null : value)
            }
          >
            <SelectTrigger id="filter-condition">
              <SelectValue placeholder="All Conditions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

