# HabitTrack

**Note!** This app is FULLY AI-generated. It was made as a test by Claude Code.

A clean, cross-device habit tracker with email/password authentication and real-time cloud sync. Built with React, Clerk, and Supabase.

**Live app:** https://retracdev.github.io/habit-track/

---

## Features

- **Today view** — check off habits, track a progress bar, see streaks
- **Schedule view** — week calendar showing completion per day
- **Habits view** — create, edit, and delete habits with daily or custom weekly schedules
- **Auth** — email/password sign-up/in via Clerk (or social providers if enabled)
- **Cross-device sync** — habit data stored in Supabase, available instantly on any device

---

## Tech stack

| Layer | Tool |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS v4 + Inter font |
| Auth | Clerk |
| Database | Supabase (Postgres) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## Local development setup

### 1. Clone and install

```bash
git clone https://github.com/retracdev/habit-track.git
cd habit-track
npm install
```

### 2. Set up Clerk

1. Create a free project at [clerk.com](https://clerk.com)
2. In your Clerk dashboard → **API Keys** → copy the **Publishable Key**
3. Enable **Email/Password** under Configure → User & Authentication → Email, Phone, Username

### 3. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run:

```sql
create table user_data (
  user_id text primary key,
  data jsonb not null default '{"habits": [], "version": 1}',
  updated_at timestamptz default now()
);
```

3. In your Supabase project → **Project Settings → API** → copy the **Project URL** and **anon/public key**

### 4. Add environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 5. Run

```bash
npm run dev
```

---

## Deploying to GitHub Pages

The app auto-deploys on every push to `main` via GitHub Actions.

You need to add your env vars as **repository secrets** so the build step can access them:

1. Go to your repo → **Settings → Secrets and variables → Actions**
2. Add three secrets:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

## Project structure

```
src/
├── components/
│   ├── AllHabitsView.jsx   # Manage all habits
│   ├── AuthPage.jsx        # Clerk sign-in / sign-up UI
│   ├── HabitCard.jsx       # Single habit row
│   ├── HabitModal.jsx      # Add / edit habit form
│   ├── ScheduleView.jsx    # Weekly calendar view
│   └── TodayView.jsx       # Today's habits + progress
├── hooks/
│   └── useHabits.js        # Habit state, Supabase sync, localStorage cache
├── lib/
│   └── supabase.js         # Supabase client
├── App.jsx                 # Root — Clerk auth gate + tab nav
├── main.jsx                # ClerkProvider entry point
└── index.css               # Tailwind + Inter font
```
