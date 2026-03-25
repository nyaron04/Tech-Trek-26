import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './pages/login'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  if (!session) {
    return <Login />
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>{session.user.email}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}

export default App