import { SignIn, SignUp } from '@clerk/clerk-react'
import { useState } from 'react'

export function AuthPage() {
  const [mode, setMode] = useState('signin')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">HabitTrack</h1>
        <p className="text-gray-400 mt-1 text-sm">Build habits that stick.</p>
      </div>

      <div className="w-full max-w-sm">
        {mode === 'signin' ? (
          <SignIn
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-sm border border-gray-100 rounded-2xl',
                headerTitle: 'font-semibold text-gray-900',
                formButtonPrimary: 'bg-violet-600 hover:bg-violet-700',
                footerActionLink: 'text-violet-600 hover:text-violet-700',
              },
            }}
            afterSignInUrl="/"
          />
        ) : (
          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-sm border border-gray-100 rounded-2xl',
                headerTitle: 'font-semibold text-gray-900',
                formButtonPrimary: 'bg-violet-600 hover:bg-violet-700',
                footerActionLink: 'text-violet-600 hover:text-violet-700',
              },
            }}
            afterSignUpUrl="/"
          />
        )}
      </div>

      <button
        onClick={() => setMode(m => m === 'signin' ? 'signup' : 'signin')}
        className="mt-4 text-sm text-gray-500 hover:text-violet-600 transition-colors"
      >
        {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
      </button>
    </div>
  )
}
