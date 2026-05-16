import { useState } from 'react'

export function SyncModal({ gistSync, rawData, importData, onClose }) {
  const [token, setToken] = useState(gistSync.token)
  const [gistId, setGistId] = useState(gistSync.gistId)
  const [saved, setSaved] = useState(false)

  function saveSettings() {
    gistSync.saveCredentials(token.trim(), gistId.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handlePush() {
    const ok = await gistSync.push(rawData)
    if (ok) alert('Data synced to GitHub Gist!')
  }

  async function handlePull() {
    const data = await gistSync.pull()
    if (data) {
      const ok = importData(data)
      if (ok) {
        alert('Data restored from GitHub Gist!')
        onClose()
      } else {
        alert('Invalid data in Gist')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-900">GitHub Gist Sync</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Back up your data to a private GitHub Gist. You need a GitHub personal access token with <strong>gist</strong> scope.
        </p>

        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Token</label>
            <input
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gist ID <span className="text-gray-400 font-normal">(leave blank to create new)</span>
            </label>
            <input
              type="text"
              value={gistId}
              onChange={e => setGistId(e.target.value)}
              placeholder="Optional existing Gist ID"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <button
            onClick={saveSettings}
            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            {saved ? '✓ Saved' : 'Save settings'}
          </button>
        </div>

        {gistSync.error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{gistSync.error}</p>
        )}

        {gistSync.lastSync && (
          <p className="text-xs text-gray-400 mb-4">
            Last sync: {new Date(gistSync.lastSync).toLocaleString()}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handlePush}
            disabled={gistSync.syncing || !token}
            className="py-2.5 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors"
          >
            {gistSync.syncing ? 'Syncing…' : '↑ Push to Gist'}
          </button>
          <button
            onClick={handlePull}
            disabled={gistSync.syncing || !token || !gistId}
            className="py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            {gistSync.syncing ? 'Syncing…' : '↓ Pull from Gist'}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Your token is stored only in your browser's localStorage.
        </p>
      </div>
    </div>
  )
}
