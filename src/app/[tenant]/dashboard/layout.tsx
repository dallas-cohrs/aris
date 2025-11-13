import { ReactNode } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { getTenantBySlug } from '@/lib/tenants'
import {
  SidebarProvider,
} from "@/components/ui/sidebar"

interface TenantLayoutProps {
  children: ReactNode
  params: Promise<{ tenant: string }>
}

export default async function DashboardLayout({
  children,
  params
}: TenantLayoutProps) {
  const { tenant: tenantSlug } = await params

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) throw new Error("Tenant not found");

  const baseUrl = `/${tenantSlug}`;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" baseUrl={baseUrl} />
      { children }
    </SidebarProvider>
  )
}
