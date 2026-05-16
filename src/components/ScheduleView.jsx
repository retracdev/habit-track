const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getWeekDates(offset = 0) {
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - today.getDay() + offset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

export function ScheduleView({ habits, habitsForDate, isCompleted }) {
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  const weekDates = getWeekDates(0)

  const monthLabel = (() => {
    const months = [...new Set(weekDates.map(d => d.getMonth()))]
    return months.map(m => MONTH_NAMES[m]).join(' / ')
  })()

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <p className="text-sm text-gray-400 font-medium">{monthLabel}</p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">This week</h1>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDates.map(date => {
          const ds = date.toISOString().slice(0, 10)
          const isToday = ds === todayStr
          const dayHabits = habitsForDate(date)
          const doneCount = dayHabits.filter(h => isCompleted(h.id, ds)).length
          const pct = dayHabits.length ? doneCount / dayHabits.length : 0

          return (
            <div key={ds} className="flex flex-col items-center gap-1.5">
              <span className="text-xs text-gray-400 font-medium">{DAY_LABELS[date.getDay()]}</span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors ${
                  isToday
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {date.getDate()}
              </div>
              {dayHabits.length > 0 && (
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-400 rounded-full"
                    style={{ width: `${pct * 100}%` }}
                  />
                </div>
              )}
              <span className="text-xs text-gray-400">
                {dayHabits.length > 0 ? `${doneCount}/${dayHabits.length}` : '—'}
              </span>
            </div>
          )
        })}
      </div>

      <div className="space-y-3">
        {weekDates.map(date => {
          const ds = date.toISOString().slice(0, 10)
          const isToday = ds === todayStr
          const dayHabits = habitsForDate(date)
          if (dayHabits.length === 0) return null

          return (
            <div key={ds}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold ${isToday ? 'text-violet-600' : 'text-gray-500'}`}>
                  {DAY_LABELS[date.getDay()]} {date.getDate()}
                  {isToday && ' · Today'}
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="space-y-1.5">
                {dayHabits.map(h => {
                  const done = isCompleted(h.id, ds)
                  return (
                    <div key={h.id} className="flex items-center gap-3 px-3 py-2 bg-white rounded-lg border border-gray-100">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: done ? h.color : '#e5e7eb' }} />
                      <span className={`text-sm ${done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{h.name}</span>
                      {done && <span className="ml-auto text-xs text-gray-400">Done</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {weekDates.every(d => habitsForDate(d).length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📅</p>
            <p className="font-medium text-gray-600">No habits scheduled this week</p>
            <p className="text-sm mt-1">Add habits from the Today tab</p>
          </div>
        )}
      </div>
    </div>
  )
}
