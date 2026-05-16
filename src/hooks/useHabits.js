import { useState, useEffect, useCallback, useRef } from 'react'
import { nanoid } from 'nanoid'
import { supabase } from '../lib/supabase'

const LOCAL_KEY = 'habittrack_data'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function emptyData() {
  return { habits: [], version: 1 }
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? JSON.parse(raw) : emptyData()
  } catch {
    return emptyData()
  }
}

function saveLocal(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
}

export function useHabits(userId) {
  const [data, setData] = useState(emptyData)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState(null)
  const saveTimer = useRef(null)

  // Load data from Supabase on mount / user change
  useEffect(() => {
    if (!userId || !supabase) {
      setData(loadLocal())
      return
    }
    setSyncing(true)
    supabase
      .from('user_data')
      .select('data')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data: row, error }) => {
        if (error) {
          setSyncError(error.message)
          setData(loadLocal())
        } else if (row) {
          setData(row.data)
          saveLocal(row.data)
        } else {
          // First time — migrate any existing local data
          const local = loadLocal()
          setData(local)
        }
        setSyncing(false)
      })
  }, [userId])

  // Debounced save to Supabase whenever data changes
  useEffect(() => {
    if (!userId) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      saveLocal(data)
      if (!supabase) return
      const { error } = await supabase
        .from('user_data')
        .upsert({ user_id: userId, data, updated_at: new Date().toISOString() })
      if (error) setSyncError(error.message)
      else setSyncError(null)
    }, 800)
    return () => clearTimeout(saveTimer.current)
  }, [data, userId])

  const mutate = useCallback(fn => {
    setData(prev => {
      const next = { ...prev, habits: prev.habits.map(h => ({ ...h })) }
      fn(next)
      return next
    })
  }, [])

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
    mutate(d => { d.habits = d.habits.filter(h => h.id !== id) })
  }

  function toggleCompletion(id, dateStr = todayStr()) {
    mutate(d => {
      const habit = d.habits.find(h => h.id === id)
      if (!habit) return
      if (habit.completions[dateStr]) delete habit.completions[dateStr]
      else habit.completions[dateStr] = true
    })
  }

  function isScheduledOn(habit, date) {
    if (habit.frequency === 'daily') return true
    return habit.days.includes(date.getDay())
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
        continue
      } else {
        break
      }
    }
    return streak
  }

  return {
    habits: data.habits,
    rawData: data,
    syncing,
    syncError,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    habitsForDate,
    isCompleted,
    isScheduledOn,
    getStreak,
    todayStr,
  }
}
