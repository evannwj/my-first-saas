'use client'

import { useState } from 'react'

export default function AiCoach() {
  const [prompt, setPrompt] = useState('')
  const [answer, setAnswer] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function askAI() {
    const cleanPrompt = prompt.trim()

    if (!cleanPrompt) {
      setMessage('Enter a question first.')
      return
    }

    setLoading(true)
    setMessage('Thinking...')
    setAnswer('')

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: cleanPrompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error ?? 'Something went wrong.')
        return
      }

      setAnswer(data.text)
      setMessage('')
    } catch {
      setMessage('Could not reach the AI route.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-10 w-full max-w-md text-left">
      <h2 className="text-2xl font-bold">AI Project Coach</h2>

      <p className="mt-2 text-sm text-zinc-500">
        Ask the AI for product, feature, or SaaS advice.
      </p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Example: Give me 3 ways to improve this project idea."
        rows={4}
        className="mt-4 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3"
      />

      <button
        onClick={askAI}
        disabled={loading}
        className="mt-3 rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:opacity-50"
      >
        {loading ? 'Thinking...' : 'Ask AI'}
      </button>

      {message && (
        <p className="mt-3 text-sm text-zinc-400">
          {message}
        </p>
      )}

      {answer && (
        <div className="mt-5 whitespace-pre-wrap rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm leading-6 text-zinc-200">
          {answer}
        </div>
      )}
    </div>
  )
}
