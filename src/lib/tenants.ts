import { createClient } from "./supabase";

/**
 * Gets a tenant by their subdomain/slug from Supabase.
 * @param slug - The tenant subdomain/slug (e.g., "acme" for acme.aris.com)
 * @returns The tenant object if found, null otherwise
 */
export async function getTenantBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .eq("name", slug)
      .single();

    if (error) {
      console.error("Error fetching tenant:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getTenantBySlug:", error);
    return null;
  }
}

/**
 * Gets all active tenants from Supabase.
 * @returns Array of active tenants
 */
export async function getActiveTenants() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .eq("active", true)
      .order("name");

    if (error) {
      console.error("Error fetching active tenants:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getActiveTenants:", error);
    return [];
  }
}
