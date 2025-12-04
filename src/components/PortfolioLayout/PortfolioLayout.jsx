// src/components/PortfolioLayout/PortfolioLayout.jsx
import React, { useEffect, useState, useRef } from 'react';
import '../../styles/PortfolioLayout.css';
import StaticSide from './StaticSide';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';

const PortfolioLayout = () => {
    // Initial state set for component mounting (not critical for mouse tracking)
    const [mousePosition, setMousePosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const [clickRipples, setClickRipples] = useState([]);
    const [activeSection, setActiveSection] = useState('about');
    const rightPanelRef = useRef(null); 
    const lastTimeRef = useRef(0);

    // Dynamic styles object derived from state for the main container
    const dynamicStyles = {
        '--cursor-x': `${mousePosition.x}px`,
        '--cursor-y': `${mousePosition.y}px`,
    };

    useEffect(() => {
        const handleMouseMove = (event) => {
            const now = Date.now();
            if (now - lastTimeRef.current < 16) return; // Throttle to ~60fps
            
            lastTimeRef.current = now;
            
            const x = event.clientX;
            const y = event.clientY;

            // 1. Update React state for local component use (magnetic effect, dynamic styles)
            setMousePosition({ x, y });

            // ⚠️ NOTE: We are removing this line and using React's style prop instead
            // document.documentElement.style.setProperty('--cursor-x', `${x}px`);
            // document.documentElement.style.setProperty('--cursor-y', `${y}px`);

            // Magnetic effect logic for hover (Wobble)
            const magneticElements = document.querySelectorAll('.magnetic-element');
            
            magneticElements.forEach(hoveredElement => {
                const rect = hoveredElement.getBoundingClientRect();
                
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    const elementCenterX = rect.left + rect.width / 2;
                    const elementCenterY = rect.top + rect.height / 2;
                    const magneticX = (x - elementCenterX) / (rect.width * 2);
                    const magneticY = (y - elementCenterY) / (rect.height * 2);
                    
                    const clampedX = Math.max(-0.5, Math.min(0.5, magneticX));
                    const clampedY = Math.max(-0.5, Math.min(0.5, magneticY));
                    
                    hoveredElement.style.setProperty('--magnetic-x', clampedX);
                    hoveredElement.style.setProperty('--magnetic-y', clampedY);
                } else {
                    hoveredElement.style.setProperty('--magnetic-x', 0);
                    hoveredElement.style.setProperty('--magnetic-y', 0);
                }
            });
        };

        const handleMouseClick = (event) => {
            const ripple = {
                id: Date.now(),
                x: event.clientX,
                y: event.clientY,
                size: Math.random() * 40 + 20,
            };
            setClickRipples(prev => [...prev, ripple]);

            setTimeout(() => {
                setClickRipples(prev => prev.filter(r => r.id !== ripple.id));
            }, 600);
        };
        
        // --- Intersection Observer Setup for Scroll Highlighting and Reveal ---
        const rightPanel = rightPanelRef.current;
        if (!rightPanel) return;

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                // Determine the highest visible section
                let newActiveSection = null;
                entries.forEach(entry => {
                    // Check if the section is intersecting and is near the top of the viewport
                    if (entry.isIntersecting && entry.boundingClientRect.top <= window.innerHeight * 0.35) {
                        // This logic prioritizes the section closest to the top margin
                        if (!newActiveSection || entry.boundingClientRect.top > document.getElementById(newActiveSection)?.getBoundingClientRect().top) {
                             newActiveSection = entry.target.id;
                        }
                    }
                });
                
                if (newActiveSection) {
                    setActiveSection(newActiveSection);
                }
            }, {
                // IMPORTANT FIX: Root must be the scrollable element
                root: rightPanel,
                // Margin controls when the state changes
                rootMargin: '-35% 0px -65% 0px', // Center band for intersection
                threshold: 0.01 // Minimal threshold to trigger observation
            }
        );

        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { 
                root: rightPanel, // Ensure reveal is based on right panel scroll
                threshold: 0.1 
            }
        );


        // Initialize Observers
        ['about', 'experience', 'projects'].forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                sectionObserver.observe(section);
                revealObserver.observe(section); 
            }
        });
        
        document.querySelectorAll('.card-wrapper').forEach(el => {
            revealObserver.observe(el);
        });
        
        // --- Event Listeners ---
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleMouseClick);
        

        return () => {
            // Cleanup
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleMouseClick);
            sectionObserver.disconnect();
            revealObserver.disconnect();
        };
    }, []); 

    return (
        // 2. Apply dynamicStyles to the main-container for the radial gradient
        <div className="main-container" style={dynamicStyles}>
            {/* Click Ripple Effects (Placed here to be over everything) */}
            {clickRipples.map(ripple => (
                <div
                    key={ripple.id}
                    className="click-ripple"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                />
            ))}
            
            {/* LEFT STATIC PANEL */}
            <aside className="left-panel">
                <StaticSide activeSection={activeSection} />
            </aside>

            {/* RIGHT SCROLLABLE PANEL */}
            <main ref={rightPanelRef} className="right-panel">
                <section id="about" className="section-reveal">
                    <About />
                </section>
                
                <section id="experience" className="section-reveal">
                    <Experience />
                </section>
                
                <section id="projects" className="section-reveal">
                    <Projects />
                </section>

                {/* Footer */}
                <footer className="section-reveal" style={{ 
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '4rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '2rem',
                    paddingBottom: '2rem'
                }}>
                    <span>
                        © 2025 Rishikesh Patil | Built with React + Vite & CSS
                    </span>
                </footer>
            </main>
        </div>
    );
};

export default PortfolioLayout;