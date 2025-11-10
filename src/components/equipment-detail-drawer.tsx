"use client"

import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  IconEdit,
  IconCalendar,
  IconMapPin,
  IconCurrencyDollar,
  IconNotes,
  IconPhoto,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Equipment, EquipmentStatus, EquipmentCondition, EquipmentType } from "@/types/equipment"
import { cn } from "@/lib/utils"

interface EquipmentDetailDrawerProps {
  equipment: Equipment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: "view" | "edit"
  onSave?: (equipment: Equipment) => void
}

const statusColors: Record<EquipmentStatus, string> = {
  available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  rented: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  maintenance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
}

export function EquipmentDetailDrawer({
  equipment,
  open,
  onOpenChange,
  mode = "view",
  onSave,
}: EquipmentDetailDrawerProps) {
  const isMobile = useIsMobile()
  const [isEditing, setIsEditing] = React.useState(mode === "edit")
  const [formData, setFormData] = React.useState<Equipment | null>(equipment)

  React.useEffect(() => {
    setFormData(equipment)
    setIsEditing(mode === "edit")
  }, [equipment, mode])

  if (!equipment) return null

  const handleSave = () => {
    if (formData) {
      onSave?.(formData)
      setIsEditing(false)
      onOpenChange(false)
    }
  }

  const updateField = <K extends keyof Equipment>(
    field: K,
    value: Equipment[K]
  ) => {
    if (formData) {
      setFormData({ ...formData, [field]: value })
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent className="max-h-[96vh]">
        <DrawerHeader className="gap-1">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle>{equipment.name}</DrawerTitle>
              <DrawerDescription>
                {equipment.id} • {equipment.type}
              </DrawerDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn("capitalize", statusColors[equipment.status])}
              >
                {equipment.status === "available" && "✅ Available"}
                {equipment.status === "rented" && "🔴 Rented"}
                {equipment.status === "maintenance" && "🔧 Maintenance"}
              </Badge>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <IconEdit className="mr-2 size-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {/* Photo Section */}
          {equipment.photoUrl ? (
            <div className="space-y-2">
              <Label>Photo</Label>
              <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                <img
                  src={equipment.photoUrl}
                  alt={equipment.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Photo</Label>
              <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <IconPhoto className="size-8" />
                  <span>No photo available</span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Basic Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Equipment Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData?.name || ""}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                ) : (
                  <div className="text-sm font-medium">{equipment.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                {isEditing ? (
                  <Input
                    id="serialNumber"
                    value={formData?.serialNumber || ""}
                    onChange={(e) => updateField("serialNumber", e.target.value)}
                  />
                ) : (
                  <div className="text-sm font-medium">{equipment.serialNumber}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                {isEditing ? (
                  <Select
                    value={formData?.type || ""}
                    onValueChange={(value) => updateField("type", value as EquipmentType)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                ) : (
                  <Badge variant="outline">{equipment.type}</Badge>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                {isEditing ? (
                  <Select
                    value={formData?.condition || ""}
                    onValueChange={(value) =>
                      updateField("condition", value as EquipmentCondition)
                    }
                  >
                    <SelectTrigger id="condition">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm font-medium capitalize">{equipment.condition}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                {isEditing ? (
                  <Select
                    value={formData?.status || ""}
                    onValueChange={(value) =>
                      updateField("status", value as EquipmentStatus)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant="outline"
                    className={cn("capitalize", statusColors[equipment.status])}
                  >
                    {equipment.status === "available" && "✅ Available"}
                    {equipment.status === "rented" && "🔴 Rented"}
                    {equipment.status === "maintenance" && "🔧 Maintenance"}
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={formData?.location || ""}
                    onChange={(e) => updateField("location", e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <IconMapPin className="size-4" />
                    {equipment.location}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Financial Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ratePerDay">Rate per Day</Label>
                {isEditing ? (
                  <Input
                    id="ratePerDay"
                    type="number"
                    value={formData?.ratePerDay || 0}
                    onChange={(e) =>
                      updateField("ratePerDay", parseFloat(e.target.value) || 0)
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <IconCurrencyDollar className="size-4" />
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(equipment.ratePerDay)}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Utilization Rate</Label>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${equipment.utilization}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{equipment.utilization}%</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="font-semibold">Dates</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Purchase Date</Label>
                <div className="flex items-center gap-2 text-sm">
                  <IconCalendar className="size-4" />
                  {new Date(equipment.purchaseDate).toLocaleDateString()}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Last Maintenance</Label>
                <div className="flex items-center gap-2 text-sm">
                  <IconCalendar className="size-4" />
                  {equipment.lastMaintenanceDate
                    ? new Date(equipment.lastMaintenanceDate).toLocaleDateString()
                    : "Never"}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Next Maintenance</Label>
                <div className="flex items-center gap-2 text-sm">
                  <IconCalendar className="size-4" />
                  {equipment.nextMaintenanceDate
                    ? new Date(equipment.nextMaintenanceDate).toLocaleDateString()
                    : "Not scheduled"}
                </div>
              </div>
            </div>
          </div>

          {equipment.assignedRenter && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Assigned Renter</Label>
                <div className="text-sm font-medium">{equipment.assignedRenter}</div>
              </div>
            </>
          )}

          <Separator />

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                value={formData?.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={4}
                placeholder="Add notes about this equipment..."
              />
            ) : (
              <div className="flex items-start gap-2 text-sm">
                <IconNotes className="mt-1 size-4" />
                <div className="flex-1">
                  {equipment.notes || "No notes available"}
                </div>
              </div>
            )}
          </div>
        </div>
        <DrawerFooter>
          {isEditing ? (
            <>
              <Button onClick={handleSave}>Save Changes</Button>
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData(equipment)
                  }}
                >
                  Cancel
                </Button>
              </DrawerClose>
            </>
          ) : (
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

