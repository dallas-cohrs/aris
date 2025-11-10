"use client"

import {
  IconPackage,
  IconTruck,
  IconCheck,
  IconTool,
} from "@tabler/icons-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Equipment } from "@/types/equipment"

interface EquipmentKPICardsProps {
  equipment: Equipment[]
}

export function EquipmentKPICards({ equipment }: EquipmentKPICardsProps) {
  const total = equipment.length
  const rented = equipment.filter((e) => e.status === "rented").length
  const available = equipment.filter((e) => e.status === "available").length
  const maintenance = equipment.filter((e) => e.status === "maintenance").length

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Equipment</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {total}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconPackage className="size-4" />
            <span>All equipment items</span>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Currently Rented</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {rented}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconTruck className="size-4" />
            <span>Out on rental</span>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Available</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {available}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconCheck className="size-4 text-green-600 dark:text-green-400" />
            <span>Ready for rental</span>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Under Maintenance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {maintenance}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconTool className="size-4 text-yellow-600 dark:text-yellow-400" />
            <span>Being serviced</span>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}

