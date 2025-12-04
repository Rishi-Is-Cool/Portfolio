import React from 'react'
import { FaGithub, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa'; // Import the icons
import profileImg from '../../assets/handsome.JPG';

const StaticSide = ({ activeSection, scrollToSection }) => {
  // Define sections once for cleaner mapping
  const sections = ['about', 'experience', 'projects'];

  return (
    <div>
      <header>
        <img 
          src={profileImg}
          alt="Rishikesh Patil Profile" 
          className="profile-photo"
        />
        
        <h1>Rishikesh Patil</h1>
        <h2>AIML enthusiastic and Web Developer</h2>
        <p className="intro-text">
          I build accessible, pixel-perfect digital experiences for the web.
        </p>
      </header>

      {/* Navigation Menu */}
      <nav className="nav-menu">
        <ul>
          {sections.map((id) => (
            <li key={id} className={activeSection === id ? 'active' : ''}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault(); // Prevent default hash jump
                  scrollToSection(id); // Trigger smooth scroll function
                }}
              >
                {id.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Social Links (Now using React Icons) */}
      <div className="social-links">
        {/* Replace YOUR_..._URL with your actual profile links */}
        <a href="https://github.com/Rishi-Is-Cool" target="_blank" aria-label="GitHub Profile">
          <FaGithub />
        </a>
        <a href="https://www.linkedin.com/in/rishikesh-patil-486194312/" target="_blank" aria-label="LinkedIn Profile">
          <FaLinkedinIn />
        </a>
        <a href="https://www.instagram.com/r1shi_6?igsh=MXdpN2I5djYwanAzaA%3D%3D&utm_source=qr" target="_blank" aria-label="Instagram Profile">
          <FaInstagram />
        </a>
        <a href="https://youtube.com/@rishikeshpatil-v9x?si=MFuV1_KF7CaAYFOQ" target="_blank" aria-label="Youtube Profile">
          <FaYoutube />
        </a>
      </div>
        <a
          href="/Rishikesh_Patil_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="resume-link magnetic-element"
        >
          View Resume
        </a>
    </div>
  )
}

export default StaticSide

