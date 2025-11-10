export type RentalStatus = "active" | "overdue" | "due_soon" | "returned"
export type PaymentStatus = "paid" | "pending" | "partial"

export interface Customer {
  id: string
  name: string
  company: string | null
  email: string
  phone: string
  address: string | null
}

export interface Rental {
  id: string
  equipmentId: string
  equipmentName: string
  equipmentType: string
  equipmentSerialNumber: string
  customerId: string
  customerName: string
  customerCompany: string | null
  startDate: string
  dueDate: string
  returnDate: string | null
  status: RentalStatus
  ratePerDay: number
  totalDays: number
  totalCost: number
  deposit: number
  paymentStatus: PaymentStatus
  paymentMethod: string | null
  notes: string | null
  returnedWithDamage: boolean
  damageNotes: string | null
}

