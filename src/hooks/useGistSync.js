import { useState } from 'react'

const GIST_TOKEN_KEY = 'habittrack_gist_token'
const GIST_ID_KEY = 'habittrack_gist_id'
const GIST_FILENAME = 'habittrack-data.json'

export function useGistSync() {
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState(null)
  const [lastSync, setLastSync] = useState(null)

  const token = localStorage.getItem(GIST_TOKEN_KEY) || ''
  const gistId = localStorage.getItem(GIST_ID_KEY) || ''

  function saveCredentials(newToken, newGistId) {
    localStorage.setItem(GIST_TOKEN_KEY, newToken)
    localStorage.setItem(GIST_ID_KEY, newGistId)
  }

  function clearCredentials() {
    localStorage.removeItem(GIST_TOKEN_KEY)
    localStorage.removeItem(GIST_ID_KEY)
  }

  async function push(rawData) {
    if (!token) { setError('No GitHub token configured'); return false }
    setSyncing(true)
    setError(null)
    try {
      const body = {
        description: 'HabitTrack data backup',
        public: false,
        files: { [GIST_FILENAME]: { content: JSON.stringify(rawData, null, 2) } },
      }
      let res, json
      if (gistId) {
        res = await fetch(`https://api.github.com/gists/${gistId}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        res = await fetch('https://api.github.com/gists', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }
      json = await res.json()
      if (!res.ok) throw new Error(json.message || 'GitHub API error')
      if (!gistId) localStorage.setItem(GIST_ID_KEY, json.id)
      setLastSync(new Date().toISOString())
      return true
    } catch (e) {
      setError(e.message)
      return false
    } finally {
      setSyncing(false)
    }
  }

  async function pull() {
    if (!token || !gistId) { setError('No Gist configured'); return null }
    setSyncing(true)
    setError(null)
    try {
      const res = await fetch(`https://api.github.com/gists/${gistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'GitHub API error')
      const content = json.files?.[GIST_FILENAME]?.content
      if (!content) throw new Error('No HabitTrack data found in Gist')
      setLastSync(new Date().toISOString())
      return JSON.parse(content)
    } catch (e) {
      setError(e.message)
      return null
    } finally {
      setSyncing(false)
    }
  }

  return {
    token,
    gistId,
    syncing,
    error,
    lastSync,
    saveCredentials,
    clearCredentials,
    push,
    pull,
  }
}
