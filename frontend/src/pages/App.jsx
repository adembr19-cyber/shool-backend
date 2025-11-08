import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Lessons from './Lessons'
import Login from './Login'

export default function App(){
  return (
    <div className="app">
      <header><h1>My School</h1><nav><Link to="/">Lessons</Link> | <Link to="/login">Login</Link></nav></header>
      <main>
        <Routes>
          <Route path="/" element={<Lessons/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </main>
    </div>
  )
}
