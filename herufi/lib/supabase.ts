import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'public' | 'member' | 'admin'

export async function getUserRole(): Promise<UserRole> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'public'

  // Check if user is admin
  if (user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) return 'admin'

  // Check if user is approved member
  const { data: member } = await supabase
    .from('approved_members')
    .select('email')
    .eq('email', user.email)
    .single()

  if (member) return 'member'
  return 'public'
}
