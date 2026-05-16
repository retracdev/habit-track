import { useState } from 'react'
import { HabitModal } from './HabitModal'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function AllHabitsView({ habits, addHabit, updateHabit, deleteHabit, getStreak }) {
  const [editingHabit, setEditingHabit] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="max-w-xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">All habits</h1>
          <p className="text-sm text-gray-400 mt-0.5">{habits.length} habit{habits.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors"
        >
          + New
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">🌱</p>
          <p className="font-medium text-gray-600">No habits yet</p>
          <p className="text-sm mt-1">Create your first habit to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map(h => {
            const streak = getStreak(h)
            return (
              <div key={h.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: h.color }} />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{h.name}</p>
                      {h.description && <p className="text-sm text-gray-400 truncate mt-0.5">{h.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {streak > 0 && (
                      <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        🔥 {streak}
                      </span>
                    )}
                    <button
                      onClick={() => setEditingHabit(h)}
                      className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteHabit(h.id)}
                      className="text-xs text-red-400 hover:text-red-600 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  {h.frequency === 'daily' ? (
                    <span className="text-xs text-gray-400 font-medium">Every day</span>
                  ) : (
                    DAY_LABELS.map((label, i) => (
                      <span
                        key={i}
                        className={`text-xs font-medium w-7 h-7 rounded-lg flex items-center justify-center ${
                          h.days.includes(i)
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                        style={h.days.includes(i) ? { backgroundColor: h.color } : {}}
                      >
                        {label}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showAdd && (
        <HabitModal onSave={addHabit} onClose={() => setShowAdd(false)} />
      )}
      {editingHabit && (
        <HabitModal
          habit={editingHabit}
          onSave={changes => updateHabit(editingHabit.id, changes)}
          onClose={() => setEditingHabit(null)}
        />
      )}
    </div>
  )
}
