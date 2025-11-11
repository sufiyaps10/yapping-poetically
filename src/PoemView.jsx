// src/PoemView.jsx
import React, { useEffect, useState } from 'react'

export default function PoemView({ list, index, onClose, onJump }) {
  const [content, setContent] = useState('Loading...')
  const [loading, setLoading] = useState(true)

  const item = list[index]
  useEffect(() => {
    let mounted = true
    setLoading(true)
    setContent('Loading...')
    const path = `/poems/${item ? item.file.startsWith('../') ? item.file : item.file : ''}`
    // try english or urdu path detection: we pass absolute file names; the calling App uses public/poems/{lang}/
    // But our poems.js filenames are only file names -- we need to determine subfolder; we can read from list path.
    // To keep it simple: attempt two locations:
    const tryPaths = [
      `/poems/english/${item.file}`,
      `/poems/urdu/${item.file}`,
      `/poems/${item.file}`,
    ]
    ;(async ()=>{
      for(const p of tryPaths){
        try {
          const res = await fetch(p)
          if(!res.ok) continue
          const txt = await res.text()
          if(!mounted) return
          setContent(txt)
          setLoading(false)
          return
        } catch(e){
          // try next
        }
      }
      if(mounted){
        setContent('Could not load poem.')
        setLoading(false)
      }
    })()
    return ()=> mounted=false
  }, [item])

  if(!item) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <h2 className="poem-title">{item.title}</h2>
        <div className="poem-body" aria-live="polite">
          {loading ? <div className="muted">Loading...</div> :
            <pre>{content}</pre>
          }
        </div>

        <div className="modal-controls">
          <button className="control" onClick={()=>onJump(index-1)} disabled={index===0}>← Previous</button>
          <button className="control" onClick={onClose}>← Back</button>
          <button className="control" onClick={()=>onJump(index+1)} disabled={index>=list.length-1}>Next →</button>
        </div>

      </div>
    </div>
  )
}
