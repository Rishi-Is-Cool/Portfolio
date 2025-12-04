import React from 'react'

const Experience = ({ id }) => {
  return (
    <div>
      <section id={id}>
        <h3>EXPERIENCE</h3>

        {/* Current Role - Tech Web Head */}
        <div>
          <p><strong>Sep 2025 — Present</strong> | Technical Head – TechWeb, IEEE-VIT Student Branch</p>
          <ul>
            <li>Lead a team of 6+ developers to maintain and enhance the official IEEE-VIT website[(https://ieee.vit.edu.in)]</li>
            <li>Currently driving a complete website overhaul – modernizing UI/UX, improving performance, and implementing new features with React, Tailwind CSS, and Node.js backend</li>
            <li>Manage deployment pipeline, domain handling, and coordination with college administration and IEEE Mumbai Section</li>
          </ul>
        </div>

        {/* CDAC Cloud Computing Course */}
        <div style={{ marginTop: '2rem' }}>
          <p><strong>Jun 2025</strong> | A Credit Course Transfer( Cloud Computing) – C-DAC ACTS, Mumbai</p>
          <ul>
            <li>Completed 160+ hours of intensive training in Cloud Architecture, AWS/Azure services, Docker, Kubernetes, CI/CD, and Microservices</li>
            <li>Built and deployed full-stack cloud-native applications as part of the credited curriculum</li>
          </ul>
        </div>

        {/* Previous IEEE Role */}
        <div style={{ marginTop: '2rem' }}>
          <p><strong>Sep 2024 — Aug 2025</strong> | Core Member (Publicity & TechWeb) – IEEE-VIT Student Branch</p>
          <ul>
            <li>Designed and developed the responsive footer and multiple dynamic sections for the official IEEE-VIT website (live at https://ieee.vit.edu.in)</li>
            <li>Created promotional graphics, managed social media tech content, and coordinated technical workshops for 500+ students</li>
          </ul>
        </div>

        {/* ECSA Core Member */}
        <div style={{ marginTop: '2rem' }}>
          <p><strong>Aug 2024 — Aug 2025</strong> | Core Committee Member – Electronics & Computer Science Students Association (ECSA), VIT</p>
          <ul>
            <li>Organized department-level technical events, seminars, and guest lectures for 300+ ECS students</li>
            <li>Handled event logistics, sponsorship outreach, and technical session coordination</li>
          </ul>
        </div>

      </section>
    </div>
  )
}

export default Experience
