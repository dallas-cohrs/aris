export type EquipmentStatus = "available" | "rented" | "maintenance"
export type EquipmentCondition = "good" | "fair" | "poor"
export type EquipmentType =
  | "Excavator"
  | "Loader"
  | "Generator"
  | "Compactor"
  | "Dozer"
  | "Crane"
  | "Forklift"
  | "Scaffolding"
  | "Other"

export interface Equipment {
  id: string
  name: string
  type: EquipmentType
  condition: EquipmentCondition
  status: EquipmentStatus
  location: string
  ratePerDay: number
  utilization: number
  serialNumber: string
  purchaseDate: string
  lastMaintenanceDate: string | null
  nextMaintenanceDate: string | null
  assignedRenter: string | null
  notes: string | null
  photoUrl: string | null
}

