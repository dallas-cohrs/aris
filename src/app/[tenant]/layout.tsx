// src/app/[tenant]/layout.tsx
import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { getTenantBySlug } from '@/lib/tenants'
import TenantProvider from '@/components/tenant-provider'

interface TenantLayoutProps {
  children: ReactNode
  params: Promise<{ tenant: string }>
}

/**
 * Tenant layout: runs on server for every tenant route (/acme, /acme/login, etc.)
 * It looks up tenant info and provides it via context for downstream components.
 */
export default async function TenantLayout({ children, params }: TenantLayoutProps) {
  const { tenant: tenantSlug } = await params

  // Lookup tenant in Supabase
  const tenant = await getTenantBySlug(tenantSlug)
  if (!tenant) notFound()

  return (
    <TenantProvider tenant={tenant}>
      <div className="min-h-screen flex flex-col">
        <header className="border-b px-6 py-4">
          <h1 className="font-semibold text-xl">{tenant.name}</h1>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </TenantProvider>
  )
}
