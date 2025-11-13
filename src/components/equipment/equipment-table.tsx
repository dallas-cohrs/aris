"use client"

import * as React from "react"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconLayoutColumns,
  IconPlus,
  IconDownload,
  IconTrash,
  IconFilter,
  IconX,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Equipment, EquipmentStatus, EquipmentCondition } from "@/types/equipment"
import { cn } from "@/lib/utils"

interface EquipmentTableProps {
  data: Equipment[]
  onEdit?: (equipment: Equipment) => void
  onView?: (equipment: Equipment) => void
  onDelete?: (equipment: Equipment) => void
  onAdd?: () => void
  onBulkAction?: (action: string, selectedIds: string[]) => void
}

const statusColors: Record<EquipmentStatus, string> = {
  available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  rented: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  maintenance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
}

const conditionColors: Record<EquipmentCondition, string> = {
  good: "text-green-600 dark:text-green-400",
  fair: "text-yellow-600 dark:text-yellow-400",
  poor: "text-red-600 dark:text-red-400",
}

const rowStatusColors: Record<EquipmentStatus, string> = {
  available: "hover:bg-green-50/50 dark:hover:bg-green-950/20",
  rented: "hover:bg-red-50/50 dark:hover:bg-red-950/20",
  maintenance: "hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20",
}

export function EquipmentTable({
  data,
  onEdit,
  onView,
  onDelete,
  onAdd,
  onBulkAction,
}: EquipmentTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const columns: ColumnDef<Equipment>[] = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "id",
        header: "Equipment ID",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("id")}</div>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue("type")}</Badge>
        ),
      },
      {
        accessorKey: "condition",
        header: "Condition",
        cell: ({ row }) => {
          const condition = row.getValue("condition") as EquipmentCondition
          return (
            <span className={cn("capitalize font-medium", conditionColors[condition])}>
              {condition}
            </span>
          )
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as EquipmentStatus
          return (
            <Badge
              variant="outline"
              className={cn("capitalize", statusColors[status])}
            >
              {status === "available" && "✅ Available"}
              {status === "rented" && "🔴 Rented"}
              {status === "maintenance" && "🔧 Maintenance"}
            </Badge>
          )
        },
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => row.getValue("location"),
      },
      {
        accessorKey: "ratePerDay",
        header: "Rate/Day",
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("ratePerDay"))
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)
          return <div className="font-medium">{formatted}</div>
        },
      },
      {
        accessorKey: "utilization",
        header: "Utilization",
        cell: ({ row }) => {
          const utilization = parseFloat(row.getValue("utilization"))
          return (
            <div className="flex items-center gap-2">
              <div className="w-16 bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${utilization}%` }}
                />
              </div>
              <span className="text-sm font-medium">{utilization}%</span>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const equipment = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                  size="icon"
                >
                  <IconDotsVertical />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => onView?.(equipment)}
                  className="cursor-pointer"
                >
                  <IconEye className="mr-2 size-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEdit?.(equipment)}
                  className="cursor-pointer"
                >
                  <IconEdit className="mr-2 size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${equipment.name}?`)) {
                      onDelete?.(equipment)
                      toast.success("Equipment deleted")
                    }
                  }}
                  className="cursor-pointer text-destructive"
                >
                  <IconTrash className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [onEdit, onView, onDelete]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const id = row.getValue("id") as string
      const name = row.getValue("name") as string
      const type = row.getValue("type") as string
      const location = row.getValue("location") as string
      return (
        id.toLowerCase().includes(search) ||
        name.toLowerCase().includes(search) ||
        type.toLowerCase().includes(search) ||
        location.toLowerCase().includes(search)
      )
    },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => row.original.id)

  const handleExportCSV = () => {
    const rows = table.getFilteredRowModel().rows
    const headers = ["ID", "Name", "Type", "Condition", "Status", "Location", "Rate/Day", "Utilization"]
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => {
        const eq = row.original
        return [
          eq.id,
          eq.name,
          eq.type,
          eq.condition,
          eq.status,
          eq.location,
          eq.ratePerDay,
          eq.utilization,
        ].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `equipment-export-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("CSV exported successfully")
  }

  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one item")
      return
    }
    onBulkAction?.(action, selectedIds)
    setRowSelection({})
    toast.success(`Bulk action "${action}" applied to ${selectedIds.length} item(s)`)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="Search equipment..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
            {globalFilter && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setGlobalFilter("")}
              >
                <IconX className="size-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconFilter className="mr-2 size-4" />
                    Bulk Actions ({selectedIds.length})
                    <IconChevronDown className="ml-2 size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleBulkAction("Mark as Available")}>
                    Mark as Available
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("Mark as Maintenance")}>
                    Mark as Maintenance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("Delete")}>
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns className="mr-2 size-4" />
                  Columns
                  <IconChevronDown className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <IconDownload className="mr-2 size-4" />
              Export CSV
            </Button>
            <Button size="sm" onClick={onAdd}>
              <IconPlus className="mr-2 size-4" />
              Add Equipment
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border px-4 lg:px-6">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const status = row.original.status
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      rowStatusColors[status],
                      row.getIsSelected() && "bg-muted"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

