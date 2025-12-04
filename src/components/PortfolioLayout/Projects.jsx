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
        description="Institutional-level mobile + web platform that digitized the entire faculty feedback process for 400+ students. Built with Flutter, Firebase Authentication, Cloud Firestore, and Python Flask backend."
        repoLink="https://github.com/YourRepoLink/Faculty-Eval" // **Update with actual GitHub link**
        liveLink={null} 
      />

      <ProjectCard
        title="RecipeWeb"
        description="A modern recipe discovery platform with user authentication, advanced search, favoriting, and responsive design. Features clean architecture, PostgreSQL backend with proper indexing, and a sleek UI built with Tailwind CSS."
        repoLink="https://github.com/YourRepoLink/RecipeWeb" // **Update with actual GitHub link**
        liveLink="https://recipweb-live.com" // **Update with actual live link**
      />
      
      {/* ... other projects ... */}
    </section>
  )
}

export default Projects
