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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

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

  function startEditing(project: Project) {
    setEditingId(project.id)
    setEditingName(project.name)
    setMessage('')
  }

  function cancelEditing() {
    setEditingId(null)
    setEditingName('')
  }

  async function saveProject(projectId: string) {
    const cleanName = editingName.trim()

    if (!cleanName) {
      setMessage('Project name cannot be empty.')
      return
    }

    const { error } = await supabase
      .from('projects')
      .update({ name: cleanName })
      .eq('id', projectId)

    if (error) {
      setMessage(error.message)
      return
    }

    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? { ...project, name: cleanName }
          : project
      )
    )

    setEditingId(null)
    setEditingName('')
    setMessage('Project updated!')
  }

  async function deleteProject(projectId: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) {
      setMessage(error.message)
      return
    }

    setProjects((current) =>
      current.filter((project) => project.id !== projectId)
    )

    if (editingId === projectId) {
      cancelEditing()
    }

    setMessage('Project deleted!')
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
              {editingId === project.id ? (
                <div className="space-y-3">
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => saveProject(project.id)}
                      className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
                    >
                      Save
                    </button>

                    <button
                      onClick={cancelEditing}
                      className="rounded-lg border border-zinc-700 px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <span>{project.name}</span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(project)}
                      className="rounded-lg border border-zinc-700 px-3 py-2 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProject(project.id)}
                      className="rounded-lg border border-zinc-700 px-3 py-2 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
