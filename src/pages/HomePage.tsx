import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Icon3D() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  )
}

function IconHeart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}

const FEATURES = [
  {
    icon: <Icon3D />,
    accent: '#4f46e5',
    accentSoft: '#eef2ff',
    title: 'Interactive 3D viewer',
    body: 'Every product has a fully interactive 3D model. Spin it around, zoom in on the details, and inspect from every angle to get a complete picture.',
  },
  {
    icon: <IconShield />,
    accent: '#0ea5e9',
    accentSoft: '#e0f2fe',
    title: 'Shop with confidence',
    body: "No more guessing from flat photos. Inspect the material, silhouette, and proportions up close so there are no surprises when it arrives.",
  },
  {
    icon: <IconHeart />,
    accent: '#ec4899',
    accentSoft: '#fdf2f8',
    title: 'Save your favourites',
    body: "Bookmark the pieces you love. Your saved items stay put across devices, ready whenever you're ready to decide.",
  },
]

const STEPS = [
  { n: '1', title: 'Browse the catalog', body: 'Pick any piece of furniture that catches your eye from our growing collection.' },
  { n: '2', title: 'Open 3D preview', body: 'One click loads a live interactive model right in your browser no download needed.' },
  { n: '3', title: 'Buy with certainty', body: "Once you're satisfied, go straight to the store and complete your purchase." },
]

export function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section className={`page home-page${mounted ? ' home-page--in' : ''}`}>
      {/* Hero */}
      <div className="home-hero">
        <div className="home-hero__orb home-hero__orb--a" aria-hidden="true" />
        <div className="home-hero__orb home-hero__orb--b" aria-hidden="true" />
        <div className="home-anim home-anim--d0">
          <span className="stat-pill">✦ Interactive 3D furniture preview</span>
          <h1 className="home-hero__headline">
            See your furniture in{' '}
            <span className="home-hero__accent">3D</span>
            <br />before it's in your home
          </h1>
          <p className="home-hero__sub">
            Browse our catalog and open a live, interactive 3D model for any item.
            Rotate, zoom, and inspect from every angle.
          </p>
          <div className="home-hero__ctas">
            <Link to="/catalog" className="button-link btn-primary home-cta-main">
              Browse catalog <IconArrow />
            </Link>
            <Link to="/login" className="button-link btn-secondary">
              Sign in
            </Link>
          </div>
          <div className="home-trust">
            <span>✓ All in browser</span>
            <span>✓ Free shipping to all malta</span>
            <span>✓ Free returns</span>
          </div>
        </div>
      </div> 

      {/* Features */}
      <div className="home-features">
        {FEATURES.map((f, i) => (
          <article
            key={i}
            className={`home-feature home-anim home-anim--d${i + 1} home-feature--${i}`}
          >
            <div className="home-feature__icon">{f.icon}</div>
            <h3 className="home-feature__title">{f.title}</h3>
            <p className="home-feature__body">{f.body}</p>
          </article>
        ))}
      </div>

      {/* How it works */}
      <div className="home-steps home-anim home-anim--d4">
        <p className="home-steps__label">How it works</p>
        <div className="home-steps__row">
          {STEPS.map((s, i) => (
            <div key={i} className="home-step">
              <div className="home-step__num">{s.n}</div>
              <strong className="home-step__title">{s.title}</strong>
              <p className="home-step__body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
