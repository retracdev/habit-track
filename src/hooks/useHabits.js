import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'

const STORAGE_KEY = 'habittrack_data'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function defaultData() {
  return { habits: [], version: 1 }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : defaultData()
  } catch {
    return defaultData()
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useHabits() {
  const [data, setData] = useState(load)

  useEffect(() => {
    save(data)
  }, [data])

  function mutate(fn) {
    setData(prev => {
      const next = { ...prev, habits: prev.habits.map(h => ({ ...h })) }
      fn(next)
      return next
    })
  }

  function addHabit({ name, description, frequency, days, color }) {
    mutate(d => {
      d.habits.push({
        id: nanoid(),
        name,
        description: description || '',
        frequency,
        days,
        color: color || '#7c3aed',
        createdAt: new Date().toISOString(),
        completions: {},
      })
    })
  }

  function updateHabit(id, changes) {
    mutate(d => {
      const idx = d.habits.findIndex(h => h.id === id)
      if (idx !== -1) Object.assign(d.habits[idx], changes)
    })
  }

  function deleteHabit(id) {
    mutate(d => {
      d.habits = d.habits.filter(h => h.id !== id)
    })
  }

  function toggleCompletion(id, dateStr = todayStr()) {
    mutate(d => {
      const habit = d.habits.find(h => h.id === id)
      if (!habit) return
      if (habit.completions[dateStr]) {
        delete habit.completions[dateStr]
      } else {
        habit.completions[dateStr] = true
      }
    })
  }

  function isScheduledOn(habit, date) {
    if (habit.frequency === 'daily') return true
    const dow = date.getDay()
    return habit.days.includes(dow)
  }

  function habitsForDate(date) {
    return data.habits.filter(h => isScheduledOn(h, date))
  }

  function isCompleted(habitId, dateStr = todayStr()) {
    const habit = data.habits.find(h => h.id === habitId)
    return !!(habit && habit.completions[dateStr])
  }

  function getStreak(habit) {
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      if (!isScheduledOn(habit, d)) continue
      const ds = d.toISOString().slice(0, 10)
      if (habit.completions[ds]) {
        streak++
      } else if (i === 0) {
        // today not done yet is fine — don't break streak
        continue
      } else {
        break
      }
    }
    return streak
  }

  function importData(json) {
    try {
      const parsed = typeof json === 'string' ? JSON.parse(json) : json
      if (!parsed.habits) throw new Error('Invalid data')
      setData(parsed)
      return true
    } catch {
      return false
    }
  }

  return {
    habits: data.habits,
    rawData: data,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    habitsForDate,
    isCompleted,
    isScheduledOn,
    getStreak,
    importData,
    todayStr,
  }
}
