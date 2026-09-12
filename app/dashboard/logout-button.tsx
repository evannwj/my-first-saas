'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function logOut() {
    await supabase.auth.signOut()

    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={logOut}
      className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-black"
    >
      Log Out
    </button>
  )
}