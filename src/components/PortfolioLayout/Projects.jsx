import React from 'react'

const ProjectCard = ({ title, description, repoLink, liveLink }) => (
  // Use 'card-wrapper' and 'magnetic-element' here
  <a 
    href={repoLink}
    target="_blank"
    rel="noopener noreferrer"
    className="card-wrapper magnetic-element"
    style={{ marginTop: '2rem' }}
  >
    <h4>{title}</h4>
    <p>{description}</p>

    {liveLink && (
      <span style={{ color: 'var(--color-accent-primary)', fontSize: '0.9rem', display: 'block', marginTop: '0.5rem' }}>
        View Live Site &rarr;
      </span>
    )}
  </a>
);

const Projects = ({ id }) => {
  return (
    <section id={id}>
      <h3>PROJECTS</h3>

      <ProjectCard
        title="Faculty Evaluation & Feedback System"
        description="Institutional-level mobile + web platform that digitized the entire faculty feedback process for 400+ students. Built with React + Vite, CSS, Supabase for Backend and Deployed on Netlify."
        repoLink="https://github.com/shrutmpatil/V-Recruitment-Interview-Evaluation-App" 
        />

      <ProjectCard
        title="RecipeWeb"
        description="A modern recipe discovery platform with user authentication, advanced search, favoriting, and responsive design. Features clean architecture, PostgreSQL backend with proper indexing, and a sleek UI."
        repoLink="https://github.com/Rishi-Is-Cool/RecipeWeb" 
        liveLink={null}
      />
      
      {/* ... other projects ... */}

      <span>
          © 2025 Rishikesh Patil | Built with React + Vite & CSS
      </span>
    </section>
  )
}

export default Projects
