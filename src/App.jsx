// src/App.jsx
import React, { useState, useMemo } from 'react'
import { englishPoems, urduPoems } from './poems'
import PoemView from './PoemView'
import './App.css'

export default function App(){
  const [lang, setLang] = useState('english')
  const [showIntro, setShowIntro] = useState(true)
  const [openIndex, setOpenIndex] = useState(null)

  const baseList = lang === 'english' ? englishPoems : urduPoems

  const sortedList = useMemo(() => {
    return [...baseList].sort((a,b) => {
      const da = a.date ? new Date(a.date) : new Date(0)
      const db = b.date ? new Date(b.date) : new Date(0)
      return db - da
    })
  }, [baseList])

  const newestFile = sortedList.length ? sortedList[0].file : null

  function openPoem(i){
    setOpenIndex(i)
    window.scrollTo({ top: 0 })
  }

  function closePoem(){
    setOpenIndex(null)
  }

  function jumpTo(i){
    if(i < 0 || i >= sortedList.length) return
    setOpenIndex(i)
  }

  return (
    <div className="site">
      {showIntro ? (
        <section className="intro full">
          <div className="intro-inner">
            <h1 className="intro-title">Yapping Poetically</h1>
            <p className="intro-sub">
              every poem is my untold wound<br/>
              everytime it's you who I write <span className="insta">- @sufiyaps_10</span>
            </p>
            <button className="enter-btn" onClick={() => setShowIntro(false)}>Enter</button>
          </div>
        </section>
      ) : null}

      <header className="site-header">
        <div className="brand">Yapping Poetically</div>
        <div className="header-right">
          <div className="lang-switch">
            <button className={lang==='english'?'pill active':'pill'} onClick={()=>setLang('english')}>English</button>
            <button className={lang==='urdu'?'pill active':'pill'} onClick={()=>setLang('urdu')}>Urdu (roman)</button>
          </div>
          <a className="insta-handle" href="https://instagram.com/sufiyaps_10" target="_blank" rel="noreferrer">@sufiyaps_10</a>
        </div>
      </header>

      <main className="main-list">
        <div className="grid">
          {sortedList.map((p,i)=>(
            <article key={p.file} className="card" onClick={()=>openPoem(i)} tabIndex={0}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h3>{p.title}</h3>
                {p.file === newestFile && <span className="badge">Latest</span>}
              </div>
              <p className="muted">Click to read</p>
            </article>
          ))}
        </div>
      </main>

      {openIndex !== null && (
        <PoemView
          list={sortedList}
          index={openIndex}
          onClose={closePoem}
          onJump={jumpTo}
        />
      )}
    </div>
  )
}
