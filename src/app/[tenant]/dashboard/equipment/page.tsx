import EquipmentPageClient from "./equipment-client"
import { getAllEquipmentForTenant } from "@/actions/equipment"

export default async function EquipmentPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params

  const equipment = await getAllEquipmentForTenant(tenant)
  return <EquipmentPageClient equipment={equipment || []} />
}
