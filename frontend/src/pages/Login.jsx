import React, { useState } from 'react'
import axios from 'axios'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const submit = async e =>{
    e.preventDefault()
    try{
      const res = await axios.post('/api/auth/login', { email, password })
      setMsg('Logged in, token saved to localStorage')
      localStorage.setItem('token', res.data.token)
    }catch(err){ setMsg(err.response?.data?.message || 'Error') }
  }
  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <div><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
      <button>Login</button>
      <div>{msg}</div>
    </form>
  )
}
