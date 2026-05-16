import { HabitCard } from './HabitCard'
import { HabitModal } from './HabitModal'
import { useState } from 'react'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function TodayView({ habits, habitsForDate, isCompleted, toggleCompletion, updateHabit, deleteHabit, getStreak, addHabit }) {
  const [editingHabit, setEditingHabit] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  const todayHabits = habitsForDate(today)
  const doneCount = todayHabits.filter(h => isCompleted(h.id, todayStr)).length

  const allDone = todayHabits.length > 0 && doneCount === todayHabits.length

  return (
    <div className="max-w-xl mx-auto w-full">
      <div className="mb-6">
        <p className="text-sm text-gray-400 font-medium">
          {DAY_NAMES[today.getDay()]}, {MONTH_NAMES[today.getMonth()]} {today.getDate()}
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">
          {allDone ? 'All done today! 🎉' : "Today's habits"}
        </h1>
        {todayHabits.length > 0 && (
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${todayHabits.length ? (doneCount / todayHabits.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-400">{doneCount}/{todayHabits.length}</span>
          </div>
        )}
      </div>

      {todayHabits.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">✨</p>
          <p className="font-medium text-gray-600">No habits scheduled today</p>
          <p className="text-sm mt-1">Add a habit to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {todayHabits.map(h => (
            <HabitCard
              key={h.id}
              habit={h}
              completed={isCompleted(h.id, todayStr)}
              onToggle={() => toggleCompletion(h.id, todayStr)}
              onEdit={() => setEditingHabit(h)}
              onDelete={() => deleteHabit(h.id)}
              streak={getStreak(h)}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setShowAdd(true)}
        className="mt-6 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-400 hover:border-violet-300 hover:text-violet-500 transition-colors"
      >
        + Add habit
      </button>

      {showAdd && (
        <HabitModal
          onSave={addHabit}
          onClose={() => setShowAdd(false)}
        />
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
