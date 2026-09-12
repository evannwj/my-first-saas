'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function signUp() {
    setMessage('Creating account...')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  async function logIn() {
    setMessage('Logging in...')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center">
          Kittykuan
        </h1>

        <p className="mt-3 text-zinc-400 text-center">
          Create an account or log in.
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3"
          />

          <button
            onClick={logIn}
            className="w-full rounded-xl bg-white text-black font-semibold py-3"
          >
            Log In
          </button>

          <button
            onClick={signUp}
            className="w-full rounded-xl border border-zinc-700 font-semibold py-3"
          >
            Create Account
          </button>

          {message && (
            <p className="text-center text-sm text-zinc-400">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}