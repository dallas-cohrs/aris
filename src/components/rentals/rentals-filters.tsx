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
import { Input } from "@/components/ui/input"
import { RentalStatus } from "@/types/rental"

interface RentalsFiltersProps {
  onFilterChange: (filters: RentalsFilters) => void
  customers: string[]
  equipmentTypes: string[]
}

export interface RentalsFilters {
  status: string | null
  customer: string | null
  equipmentType: string | null
  dateRange: string | null
  search: string
}

export function RentalsFilters({
  onFilterChange,
  customers,
  equipmentTypes,
}: RentalsFiltersProps) {
  const [filters, setFilters] = React.useState<RentalsFilters>({
    status: null,
    customer: null,
    equipmentType: null,
    dateRange: null,
    search: "",
  })

  const updateFilter = (key: keyof RentalsFilters, value: string | null) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: RentalsFilters = {
      status: null,
      customer: null,
      equipmentType: null,
      dateRange: null,
      search: "",
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== null && v !== "")

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
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by Equipment, Customer, or Rental ID..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="due_soon">Due Soon</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-customer">Customer</Label>
            <Select
              value={filters.customer || ""}
              onValueChange={(value) =>
                updateFilter("customer", value === "all" ? null : value)
              }
            >
              <SelectTrigger id="filter-customer">
                <SelectValue placeholder="All Customers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer} value={customer}>
                    {customer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-equipment-type">Equipment Category</Label>
            <Select
              value={filters.equipmentType || ""}
              onValueChange={(value) =>
                updateFilter("equipmentType", value === "all" ? null : value)
              }
            >
              <SelectTrigger id="filter-equipment-type">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {equipmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-date-range">Date Range</Label>
            <Select
              value={filters.dateRange || ""}
              onValueChange={(value) =>
                updateFilter("dateRange", value === "all" ? null : value)
              }
            >
              <SelectTrigger id="filter-date-range">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="this_quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

