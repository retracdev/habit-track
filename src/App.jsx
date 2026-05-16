import { useState } from 'react'
import { useUser, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react'
import { useHabits } from './hooks/useHabits'
import { TodayView } from './components/TodayView'
import { ScheduleView } from './components/ScheduleView'
import { AllHabitsView } from './components/AllHabitsView'
import { AuthPage } from './components/AuthPage'
import './index.css'

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'habits', label: 'Habits' },
]

function AppShell() {
  const { user } = useUser()
  const [tab, setTab] = useState('today')

  const {
    habits, addHabit, updateHabit, deleteHabit,
    toggleCompletion, habitsForDate, isCompleted, getStreak,
    syncing, syncError,
  } = useHabits(user?.id)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-gray-900 tracking-tight">HabitTrack</span>
          <div className="flex items-center gap-3">
            {syncing && (
              <span className="text-xs text-gray-400 animate-pulse">Syncing…</span>
            )}
            {syncError && !syncing && (
              <span className="text-xs text-red-400" title={syncError}>Sync failed</span>
            )}
            <UserButton afterSignOutUrl="/" />
          </div>
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
    </div>
  )
}

export default function App() {
  return (
    <>
      <SignedIn>
        <AppShell />
      </SignedIn>
      <SignedOut>
        <AuthPage />
      </SignedOut>
    </>
  )
}
