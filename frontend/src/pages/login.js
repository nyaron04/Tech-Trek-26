import { useState } from 'react'
import { supabase } from '../supabaseClient'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSignUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) alert(error.message)
    else alert('Check your email if confirmation is required.')
  }

  async function handleSignIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) alert(error.message)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleSignIn} style={{ marginLeft: '1rem' }}>
        Sign In
      </button>
    </div>
  )
}

export default Login