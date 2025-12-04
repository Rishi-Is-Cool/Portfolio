import React from 'react'

const ExperienceCard = ({ time, title, link, details }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="card-wrapper magnetic-element">
    <p style={{ fontSize: '0.8rem', color: 'var(--color-accent-primary)' }}>{time}</p>
    <h4>{title}</h4>
    <ul>
      {details.map((detail, index) => (
        <li key={index}>{detail}</li>
      ))}
    </ul>
  </a>
);

const Experience = ({ id }) => {
  return (
    <div>
      <section id={id}>
        <h3>EXPERIENCE</h3>

        <ExperienceCard 
        time="Sep 2025 — Present"
        title="Technical Head – TechWeb, IEEE-VIT Student Branch"
        link="https://ieee.vit.edu.in"
        details={[
          "Lead a team of 6+ developers to maintain and enhance the official IEEE-VIT website.",
          "Currently driving a complete website overhaul – modernizing UI/UX, improving performance, and implementing new features with React, Tailwind CSS, and Node.js backend.",
          "Manage deployment pipeline, domain handling, and coordination with college administration and IEEE Mumbai Section."
        ]}
      />
        <ExperienceCard 
        time="Jun 2025"
        title="Credit Transfer Course ( Cloud Computing) – C-DAC ACTS, Mumbai"
        link="https://ieee.vit.edu.in"
        details={[
          "Completed 50 hours of intensive training in Cloud Architecture, AWS/Azure services, Docker, Kubernetes, CI/CD, and Microservices",
          "Built and deployed full-stack cloud-native applications as part of the credited curriculum"
        ]}
      />
        <ExperienceCard 
        time="Sep 2024 — Aug 2025"
        title="Core Member (Publicity & TechWeb) – IEEE-VIT Student Branch"
        link="https://ieee.vit.edu.in"
        details={[
          "Designed and developed the responsive footer and multiple dynamic sections for the official IEEE-VIT website (live at https://ieee.vit.edu.in)",
          "Created promotional graphics, managed social media tech content, and coordinated technical workshops for 500+ students."
        ]}
      />
        <ExperienceCard 
        time="Aug 2024 — Aug 2025"
        title="Core Committee Member – Electronics & Computer Science Students Association (ECSA)"
        details={[
          "Organized department-level technical events, seminars, and guest lectures for 300+ ECS students",
          "Handled event logistics, sponsorship outreach, and technical session coordination."
        ]}
      />
      </section>
    </div>
  )
}

export default Experience
