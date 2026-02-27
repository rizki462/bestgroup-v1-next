import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { environment } from '@/config/environment'

export async function createAdminClient() {
  const cookieStore = await cookies()
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = environment;

  return createServerClient(
    SUPABASE_URL!,
    SUPABASE_SERVICE_ROLE_KEY!, // Menggunakan Service Role untuk bypass RLS
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Safe to ignore if called from a Server Action
          }
        },
      },
    }
  )
}