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
      <div class="social-links">
        <a href="YOUR_GITHUB_URL" target="_blank" aria-label="GitHub Profile">
          <i class="fab fa-github"></i>
        </a>
        <a href="YOUR_LINKEDIN_URL" target="_blank" aria-label="LinkedIn Profile">
          <i class="fab fa-linkedin-in"></i>
        </a>
        <a href="YOUR_TWITTER_URL" target="_blank" aria-label="Twitter Profile">
          <i class="fab fa-twitter"></i>
        </a>
      </div>
    </div>
  )
}

export default StaticSide
