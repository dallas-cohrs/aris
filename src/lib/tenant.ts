import { headers } from 'next/headers'

export async function getTenantFromRequest() {
  const headersList = await headers()
  const host = headersList.get('host') || ''

  const isLocal = host.includes('localhost')
  const subdomain = isLocal ? host.split('.')[0] : host.split('.')[0]

  if (!subdomain || subdomain === 'aris') return null
  return subdomain
}
