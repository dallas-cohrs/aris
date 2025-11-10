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
import { CustomerStatus, CustomerType } from "@/types/customer"

interface CustomersFiltersProps {
  onFilterChange: (filters: CustomersFilters) => void
}

export interface CustomersFilters {
  status: string | null
  type: string | null
  sort: string | null
  search: string
}

export function CustomersFilters({
  onFilterChange,
}: CustomersFiltersProps) {
  const [filters, setFilters] = React.useState<CustomersFilters>({
    status: null,
    type: null,
    sort: null,
    search: "",
  })

  const updateFilter = (key: keyof CustomersFilters, value: string | null) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: CustomersFilters = {
      status: null,
      type: null,
      sort: null,
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
            placeholder="Search by name, company, or email..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
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
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-type">Type</Label>
            <Select
              value={filters.type || ""}
              onValueChange={(value) =>
                updateFilter("type", value === "all" ? null : value)
              }
            >
              <SelectTrigger id="filter-type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-sort">Sort</Label>
            <Select
              value={filters.sort || ""}
              onValueChange={(value) =>
                updateFilter("sort", value === "default" ? null : value)
              }
            >
              <SelectTrigger id="filter-sort">
                <SelectValue placeholder="Recent Activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Recent Activity</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="balance">Balance (High to Low)</SelectItem>
                <SelectItem value="balance_low">Balance (Low to High)</SelectItem>
                <SelectItem value="rentals">Total Rentals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

