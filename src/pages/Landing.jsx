import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Landing() {
  const [showAbout, setShowAbout] = useState(false)
  const { signInWithGoogle } = useAuth()

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Google sign-in failed:', error)
    }
  }

  return (
    <div className="app">

      {/* TOP NAVIGATION */}
      <header className="topbar">

        <div className="brand">
          <div className="top-logo">
            🔗 Linkie
          </div>
        </div>

        <div className="top-actions">

          <button
            className="about-button"
            onClick={() => setShowAbout(true)}
            aria-label="About the creator"
          >
            ⓘ
            <span>About Creator</span>
          </button>

          <button className="google-button" onClick={handleGoogleSignIn}>
            <span className="google-g">G</span>
            <span className="google-text">
              Continue with Google
            </span>
          </button>

        </div>
      </header>


      {/* MAIN WELCOME PAGE */}
      <main className="welcome-page">

        <section className="welcome-content">

          <div className="main-link-icon">
            🔗
          </div>

          <h1>
            Save every important link in one place.
          </h1>

          <p>
            Linkie helps you save, organize and quickly find
            all your important links.
          </p>

          <button className="continue-button" onClick={handleGoogleSignIn}>
            <span className="google-g">G</span>
            Continue with Google
          </button>

          <p className="small-text">
            Secure and simple. Your links stay connected to your account.
          </p>

          <p className="credit">
            By Christopher Ainoo (M.K.N Tech) ⚡
          </p>

        </section>

      </main>


      {/* ABOUT CREATOR MODAL */}
      {showAbout && (
        <div
          className="modal-overlay"
          onClick={() => setShowAbout(false)}
        >

          <div
            className="about-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-button"
              onClick={() => setShowAbout(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="developer-icon">
              ⚡
            </div>

            <h2>About the Developer</h2>

            <p>
              Linkie was developed by{' '}
              <strong>Christopher Ainoo</strong>.
            </p>

            <p className="developer-company">
              M.K.N Tech
            </p>

            <button
              className="close-modal-button"
              onClick={() => setShowAbout(false)}
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  )
}