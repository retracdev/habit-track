import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import { useGistSync } from './hooks/useGistSync'
import { TodayView } from './components/TodayView'
import { ScheduleView } from './components/ScheduleView'
import { AllHabitsView } from './components/AllHabitsView'
import { SyncModal } from './components/SyncModal'
import './index.css'

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'habits', label: 'Habits' },
]

export default function App() {
  const [tab, setTab] = useState('today')
  const [showSync, setShowSync] = useState(false)

  const {
    habits, rawData, addHabit, updateHabit, deleteHabit,
    toggleCompletion, habitsForDate, isCompleted, getStreak, importData,
  } = useHabits()

  const gistSync = useGistSync()

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-gray-900 tracking-tight">HabitTrack</span>
          <button
            onClick={() => setShowSync(true)}
            title="GitHub Gist Sync"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-violet-600 text-violet-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {tab === 'today' && (
          <TodayView
            habits={habits}
            habitsForDate={habitsForDate}
            isCompleted={isCompleted}
            toggleCompletion={toggleCompletion}
            updateHabit={updateHabit}
            deleteHabit={deleteHabit}
            getStreak={getStreak}
            addHabit={addHabit}
          />
        )}
        {tab === 'schedule' && (
          <ScheduleView
            habits={habits}
            habitsForDate={habitsForDate}
            isCompleted={isCompleted}
          />
        )}
        {tab === 'habits' && (
          <AllHabitsView
            habits={habits}
            addHabit={addHabit}
            updateHabit={updateHabit}
            deleteHabit={deleteHabit}
            getStreak={getStreak}
          />
        )}
      </main>

      {showSync && (
        <SyncModal
          gistSync={gistSync}
          rawData={rawData}
          importData={importData}
          onClose={() => setShowSync(false)}
        />
      )}
    </div>
  )
}
