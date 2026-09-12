'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Project = {
  id: string
  name: string
  created_at: string
}

export default function ProjectsPanel() {
  const supabase = createClient()

  const [projects, setProjects] = useState<Project[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  async function loadProjects() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('projects')
      .select('id, name, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setMessage(error.message)
      return
    }

    setProjects(data ?? [])
  }

  async function createProject() {
    const cleanName = name.trim()

    if (!cleanName) {
      setMessage('Enter a project name.')
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMessage('You are not logged in.')
      return
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: cleanName,
        user_id: user.id,
      })
      .select('id, name, created_at')
      .single()

    if (error) {
      setMessage(error.message)
      return
    }

    setProjects((current) => [data, ...current])
    setName('')
    setMessage('Project created!')
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return (
    <div className="mt-10 w-full max-w-md text-left">
      <h2 className="text-2xl font-bold">My Projects</h2>

      <div className="mt-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3"
        />

        <button
          onClick={createProject}
          className="rounded-xl bg-white px-5 py-3 font-semibold text-black"
        >
          Create
        </button>
      </div>

      {message && (
        <p className="mt-3 text-sm text-zinc-400">
          {message}
        </p>
      )}

      <div className="mt-6 space-y-3">
        {projects.length === 0 ? (
          <p className="text-zinc-500">No projects yet.</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
            >
              {project.name}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
