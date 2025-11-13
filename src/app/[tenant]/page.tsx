// src/app/[tenant]/page.tsx
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'

export default async function TenantEntryPage({ 
  params 
}: { 
  params: Promise<{ tenant: string }> 
}) {
  const { tenant } = await params
  const user = await getUser()

  if (user) {
    redirect(`/${tenant}/dashboard`)
  } else {
    redirect(`/${tenant}/login`)
  }
}
