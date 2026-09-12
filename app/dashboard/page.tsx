import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from './logout-button'
import ProjectsPanel from './projects-panel'
import AiCoach from './ai-coach'
import BillingCard from './billing-card'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-2xl flex-col items-center text-center">
        <p className="text-zinc-400">Welcome to</p>

        <h1 className="mt-2 text-5xl font-bold">
          Kittykuan Dashboard
        </h1>

        <p className="mt-6 text-zinc-400">
          Logged in as:
        </p>

        <p className="mt-2 text-lg font-semibold">
          {user.email}
        </p>

        <LogoutButton />
        <ProjectsPanel />
        <AiCoach />
        <BillingCard />

        <p className="mt-10 text-sm text-zinc-600">
          This page is private.
        </p>
      </div>
    </main>
  )
}
