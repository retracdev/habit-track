import { useState } from 'react'

export function HabitCard({ habit, completed, onToggle, onEdit, onDelete, streak }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 group">
      <button
        onClick={onToggle}
        className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
        style={{
          borderColor: completed ? habit.color : '#d1d5db',
          backgroundColor: completed ? habit.color : 'transparent',
        }}
        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {completed && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {habit.name}
        </p>
        {habit.description && (
          <p className="text-xs text-gray-400 truncate mt-0.5">{habit.description}</p>
        )}
      </div>

      {streak > 0 && (
        <span className="flex-shrink-0 flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
          <span>🔥</span>
          <span>{streak}</span>
        </span>
      )}

      <div className="relative flex-shrink-0">
        <button
          onClick={() => setShowMenu(v => !v)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-gray-100 text-gray-400 transition-opacity"
          aria-label="More options"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="3" r="1.2" />
            <circle cx="8" cy="8" r="1.2" />
            <circle cx="8" cy="13" r="1.2" />
          </svg>
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-32">
              <button
                onClick={() => { onEdit(); setShowMenu(false) }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => { onDelete(); setShowMenu(false) }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
