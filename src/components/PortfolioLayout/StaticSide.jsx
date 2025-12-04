import React from 'react'

const StaticSide = ({ activeSection }) => {
  return (
    <div>
      <header>
        <h1>Rishikesh Patil</h1>
        <h2>AIML enthusiastic and Web Developer</h2>
        <p className="intro-text">
          I build accessible, pixel-perfect digital experiences for the web.
        </p>
      </header>
      
      {/* Navigation Menu */}
      <nav className="nav-menu">
      <ul>
        <li>
          <a 
            href="#about" 
            className={activeSection === 'about' ? 'active' : ''}
          >
            ABOUT
          </a>
        </li>
        <li>
          <a 
            href="#experience" 
            className={activeSection === 'experience' ? 'active' : ''}
          >
            EXPERIENCE
          </a>
        </li>
        <li>
          <a 
            href="#projects" 
            className={activeSection === 'projects' ? 'active' : ''}
          >
            PROJECTS
          </a>
        </li>
      </ul>
    </nav>

      {/* Social Links (placed at the bottom via flexbox in CSS) */}
      <div className="social-links">
        {/* Replace with actual icon components (e.g., from react-icons) */}
        <a href="https://github.com/..." target="_blank" rel="noopener noreferrer">GitHub</a> | 
        <a href="https://linkedin.com/..." target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </div>
  )
}

export default StaticSide
