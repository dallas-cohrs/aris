"use client"

import * as React from "react"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconEye,
  IconCheck,
  IconClock,
  IconLayoutColumns,
  IconPlus,
  IconDownload,
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
import { Rental, RentalStatus } from "@/types/rental"
import { cn } from "@/lib/utils"

interface RentalsTableProps {
  data: Rental[]
  onView?: (rental: Rental) => void
  onReturn?: (rental: Rental) => void
  onExtend?: (rental: Rental) => void
  onAdd?: () => void
  search?: string
}

const statusColors: Record<RentalStatus, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  due_soon: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  returned: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
}

const statusIcons: Record<RentalStatus, string> = {
  active: "🟢",
  overdue: "🔴",
  due_soon: "🟡",
  returned: "⚪",
}

const statusLabels: Record<RentalStatus, string> = {
  active: "Active",
  overdue: "Overdue",
  due_soon: "Due Soon",
  returned: "Returned",
}

const rowStatusColors: Record<RentalStatus, string> = {
  active: "hover:bg-green-50/50 dark:hover:bg-green-950/20",
  overdue: "hover:bg-red-50/50 dark:hover:bg-red-950/20",
  due_soon: "hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20",
  returned: "hover:bg-gray-50/50 dark:hover:bg-gray-950/20",
}

export function RentalsTable({
  data,
  onView,
  onReturn,
  onExtend,
  onAdd,
  search = "",
}: RentalsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = React.useState(search)

  React.useEffect(() => {
    setGlobalFilter(search)
  }, [search])

  const columns: ColumnDef<Rental>[] = React.useMemo(
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
        header: "Rental ID",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("id")}</div>
        ),
      },
      {
        accessorKey: "equipmentName",
        header: "Equipment",
        cell: ({ row }) => {
          const rental = row.original
          return (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-medium">
                {rental.equipmentName.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{rental.equipmentName}</div>
                <div className="text-xs text-muted-foreground">
                  {rental.equipmentType}
                </div>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "customerName",
        header: "Customer",
        cell: ({ row }) => {
          const rental = row.original
          return (
            <div>
              <div className="font-medium">
                {rental.customerCompany || rental.customerName}
              </div>
              {rental.customerCompany && (
                <div className="text-xs text-muted-foreground">
                  {rental.customerName}
                </div>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "startDate",
        header: "Start Date",
        cell: ({ row }) => {
          const date = new Date(row.getValue("startDate"))
          return <div>{date.toLocaleDateString()}</div>
        },
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) => {
          const date = new Date(row.getValue("dueDate"))
          return <div>{date.toLocaleDateString()}</div>
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as RentalStatus
          return (
            <Badge
              variant="outline"
              className={cn("capitalize", statusColors[status])}
            >
              {statusIcons[status]} {statusLabels[status]}
            </Badge>
          )
        },
      },
      {
        accessorKey: "totalCost",
        header: "Total",
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("totalCost"))
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)
          return <div className="font-medium">{formatted}</div>
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const rental = row.original
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
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => onView?.(rental)}
                  className="cursor-pointer"
                >
                  <IconEye className="mr-2 size-4" />
                  View Details
                </DropdownMenuItem>
                {rental.status !== "returned" && (
                  <>
                    <DropdownMenuItem
                      onClick={() => onReturn?.(rental)}
                      className="cursor-pointer"
                    >
                      <IconCheck className="mr-2 size-4" />
                      Mark Returned
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onExtend?.(rental)}
                      className="cursor-pointer"
                    >
                      <IconClock className="mr-2 size-4" />
                      Extend Rental
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [onView, onReturn, onExtend]
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
      const equipmentName = row.original.equipmentName
      const customerName = row.original.customerName
      const customerCompany = row.original.customerCompany || ""
      return (
        id.toLowerCase().includes(search) ||
        equipmentName.toLowerCase().includes(search) ||
        customerName.toLowerCase().includes(search) ||
        customerCompany.toLowerCase().includes(search)
      )
    },
  })

  const handleExportCSV = () => {
    const rows = table.getFilteredRowModel().rows
    const headers = [
      "Rental ID",
      "Equipment",
      "Customer",
      "Start Date",
      "Due Date",
      "Status",
      "Total",
    ]
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => {
        const rental = row.original
        return [
          rental.id,
          rental.equipmentName,
          rental.customerCompany || rental.customerName,
          rental.startDate,
          rental.dueDate,
          rental.status,
          rental.totalCost,
        ].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rentals-export-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("CSV exported successfully")
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            {search && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Searching: "{search}"</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setGlobalFilter("")}
                  className="h-6 w-6"
                >
                  <IconX className="size-3" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
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
              New Rental
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

