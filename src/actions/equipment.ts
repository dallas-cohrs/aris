"use server"

import { createClient } from "@/lib/supabase"

export async function getAllEquipmentForTenant(tenantSlug: string) {
  const supabase = await createClient()

  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", tenantSlug)
    .single()

  if (tenantError || !tenant) throw new Error("Tenant not found")

  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .eq("tenant_id", tenant.id)

  if (error) throw error
  return data
}
