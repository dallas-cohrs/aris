"use server"

import { createClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getTenantBySlug } from "@/lib/tenants"

export interface LoginFormState {
  error?: string
  success?: boolean
}

/**
 * Server action to handle user login for a tenant.
 * - Looks up tenant by slug
 * - Signs in via Supabase Auth
 * - Verifies the user's tenant
 * - Redirects to /[tenant]/dashboard if valid
 */
export async function loginAction(
  formData: FormData,
  tenantSlug: string
): Promise<LoginFormState> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    console.log(tenantSlug)
    // 1️⃣ Verify tenant exists
    const tenant = await getTenantBySlug(tenantSlug)
    if (!tenant) {
      return { error: "Invalid tenant" }
    }

    // 2️⃣ Create Supabase client (server-side)
    const supabase = await createClient()

    // 3️⃣ Sign in using Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (authError || !authData.user) {
      return { error: authError?.message || "Invalid email or password" }
    }

    const userId = authData.user.id

    // 4️⃣ Verify user's tenant in your public.users table
    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userId)
      .single()

    if (userError || !userRecord) {
      return { error: "User record not found" }
    }

    // 5️⃣ Ensure user belongs to this tenant
    if (userRecord.tenant_id !== tenant.id) {
      await supabase.auth.signOut()
      return { error: "User does not belong to this tenant" }
    }

    // 6️⃣ Everything good — redirect to dashboard
    revalidatePath(`/${tenantSlug}/dashboard`)
    return { success: true }
    
  } catch (err: any) {
    console.error("Login error:", err)
    return { error: err.message || "An error occurred during login" }
  }
}
