import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Lessons(){
  const [lessons, setLessons] = useState([])
  useEffect(()=>{
    axios.get('/api/lessons')
      .then(r=>setLessons(r.data.data || r.data))
      .catch(console.error)
  },[])
  return (
    <div>
      <h2>Lessons</h2>
      <ul>
        {lessons.map(l=> (
          <li key={l._id}>{l.title} - {new Date(l.datetime).toLocaleString()} - {l.teacher?.name}</li>
        ))}
      </ul>
    </div>
  )
}
