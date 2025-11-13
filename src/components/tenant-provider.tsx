'use client'
import { createContext, useContext } from 'react'

// The context object that holds the tenant info
const TenantContext = createContext<any>(null)

/**
 * Access tenant info anywhere in client components.
 */
export function useTenant() {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenant must be used within a <TenantProvider>')
  return ctx
}

/**
 * Provider that makes tenant data available to all child components.
 */
export default function TenantProvider({
  tenant,
  children,
}: {
  tenant: any
  children: React.ReactNode
}) {
  return <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
}
