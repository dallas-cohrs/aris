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
  IconEdit,
  IconTrash,
  IconLayoutColumns,
  IconPlus,
  IconDownload,
  IconUser,
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
} from "@tanstack/react-table"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Customer, CustomerStatus, CustomerStats } from "@/types/customer"
import { cn } from "@/lib/utils"

interface CustomersTableProps {
  data: Customer[]
  customerStats: CustomerStats[]
  onView?: (customer: Customer) => void
  onEdit?: (customer: Customer) => void
  onDelete?: (customer: Customer) => void
  onAdd?: () => void
  search?: string
}

const statusColors: Record<CustomerStatus, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function CustomersTable({
  data,
  customerStats,
  onView,
  onEdit,
  onDelete,
  onAdd,
  search = "",
}: CustomersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState(search)

  React.useEffect(() => {
    setGlobalFilter(search)
  }, [search])

  // Combine customers with their stats
  const customersWithStats = React.useMemo(() => {
    return data.map((customer) => {
      const stats = customerStats.find((s) => s.customerId === customer.id) || {
        customerId: customer.id,
        activeRentals: 0,
        totalRentals: 0,
        outstandingBalance: 0,
        totalSpent: 0,
        averageRentalValue: 0,
      }
      return { ...customer, stats }
    })
  }, [data, customerStats])

  const columns: ColumnDef<typeof customersWithStats[0]>[] = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Customer",
        cell: ({ row }) => {
          const customer = row.original
          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{customer.name}</div>
                {customer.company && (
                  <div className="text-xs text-muted-foreground">
                    {customer.company}
                  </div>
                )}
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "company",
        header: "Company",
        cell: ({ row }) => {
          const company = row.original.company
          return (
            <div className="text-sm">{company || "—"}</div>
          )
        },
      },
      {
        id: "activeRentals",
        header: "Active Rentals",
        cell: ({ row }) => {
          const stats = row.original.stats
          return (
            <div className="text-sm font-medium">{stats.activeRentals}</div>
          )
        },
      },
      {
        id: "totalRentals",
        header: "Total Rentals",
        cell: ({ row }) => {
          const stats = row.original.stats
          return (
            <div className="text-sm font-medium">{stats.totalRentals}</div>
          )
        },
      },
      {
        id: "outstandingBalance",
        header: "Outstanding Balance",
        cell: ({ row }) => {
          const stats = row.original.stats
          const balance = stats.outstandingBalance
          return (
            <div
              className={cn(
                "text-sm font-medium",
                balance > 0 && "text-red-600 dark:text-red-400"
              )}
            >
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(balance)}
            </div>
          )
        },
      },
      {
        accessorKey: "lastActivity",
        header: "Last Activity",
        cell: ({ row }) => {
          const lastActivity = row.original.lastActivity
          if (!lastActivity) return <div className="text-sm text-muted-foreground">Never</div>
          const date = new Date(lastActivity)
          return <div className="text-sm">{date.toLocaleDateString()}</div>
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as CustomerStatus
          const stats = row.original.stats
          return (
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn("capitalize", statusColors[status])}
              >
                {status === "active" ? "🟢 Active" : "⚪ Inactive"}
              </Badge>
              {stats.outstandingBalance > 0 && (
                <Badge variant="destructive" className="text-xs">
                  Delinquent
                </Badge>
              )}
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const customer = row.original
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
                  onClick={() => onView?.(customer)}
                  className="cursor-pointer"
                >
                  <IconEye className="mr-2 size-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEdit?.(customer)}
                  className="cursor-pointer"
                >
                  <IconEdit className="mr-2 size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
                      onDelete?.(customer)
                      toast.success("Customer deleted")
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
    [onView, onEdit, onDelete]
  )

  const table = useReactTable({
    data: customersWithStats,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const customer = row.original
      return (
        customer.name.toLowerCase().includes(search) ||
        (customer.company?.toLowerCase().includes(search) || false) ||
        customer.email.toLowerCase().includes(search) ||
        customer.phone.toLowerCase().includes(search)
      )
    },
  })

  const handleExportCSV = () => {
    const rows = table.getFilteredRowModel().rows
    const headers = [
      "Customer",
      "Company",
      "Active Rentals",
      "Total Rentals",
      "Outstanding Balance",
      "Last Activity",
      "Status",
    ]
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => {
        const customer = row.original
        const stats = customer.stats
        return [
          customer.name,
          customer.company || "",
          stats.activeRentals,
          stats.totalRentals,
          stats.outstandingBalance,
          customer.lastActivity || "",
          customer.status,
        ].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `customers-export-${new Date().toISOString().split("T")[0]}.csv`
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
              Add Customer
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
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onView?.(row.original)}
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
          {table.getFilteredRowModel().rows.length} row(s) total.
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

