export type CustomerStatus = "active" | "inactive"
export type CustomerType = "individual" | "company"
export type CustomerHealth = "good" | "warning" | "critical"

export interface Customer {
  id: string
  name: string
  company: string | null
  email: string
  phone: string
  address: string | null
  status: CustomerStatus
  type: CustomerType
  notes: string | null
  preferredPaymentMethod: string | null
  billingInfo: string | null
  createdAt: string
  lastActivity: string | null
}

export interface CustomerStats {
  customerId: string
  activeRentals: number
  totalRentals: number
  outstandingBalance: number
  totalSpent: number
  averageRentalValue: number
}

