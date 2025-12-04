import React from 'react'

const ProjectCard = ({ title, description, repoLink, liveLink }) => (
  <a
    href={repoLink}
    target="_blank"
    rel="noopener noreferrer"
    className="project-card"
  >
    <h4>{title}</h4>
    <p>{description}</p>

    {liveLink && (
      <span style={{ color: 'var(--color-accent)', fontSize: '0.9rem', display: 'block', marginTop: '0.5rem' }}>
        View Live Site &rarr;
      </span>
    )}
  </a>
);

const Projects = ({ id }) => {
  return (
    <div>
      <section id={id}>
        <h3>PROJECTS</h3>

        <div className="project-item">
          <p><strong>Faculty Evaluation & Feedback System</strong> — Flutter + Firebase + Python</p>
          <p>Institutional-level mobile + web platform (mentored by college Principal) that digitized the entire faculty feedback process for 400+ students. Built with Flutter, Firebase Authentication, Cloud Firestore, and Python Flask backend. Currently under final deployment phase across the department.</p>
        </div>

        <div className="project-item" style={{ marginTop: '2rem' }}>
          <p><strong>RecipeWeb</strong> — Full-Stack Web App (React + Vite + PostgreSQL)</p>
          <p>A modern recipe discovery platform with user authentication, advanced search, favoriting, and responsive design. Features clean architecture, PostgreSQL backend with proper indexing, and a sleek UI built with Tailwind CSS.</p>
        </div>

        <div className="project-item" style={{ marginTop: '2rem' }}>
          <p><strong>IEEE-VIT Official Website Revamp</strong> — React + Tailwind + Node.js</p>
          <p>Leading the complete redesign and redevelopment of https://ieee.vit.edu.in as Technical Head. Previously contributed the dynamic footer and multiple interactive sections as core frontend developer (live since 2024).</p>
        </div>

        <div className="project-item" style={{ marginTop: '2rem' }}>
          <p><strong>Multi-Class Image & Text Classification Models</strong> — Python, TensorFlow, Scikit-Learn</p>
          <p>Trained and evaluated several ML models on real-world datasets (CIFAR-10, IMDB reviews, custom datasets). Experimented with CNNs, transfer learning (ResNet, MobileNet), and NLP techniques using Transformers.</p>
        </div>
      </section>
    </div>
  )
}

export default Projects
