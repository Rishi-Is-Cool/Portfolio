// src/components/PortfolioLayout/PortfolioLayout.jsx
import React, { useEffect, useState, useRef } from 'react';
import '../../styles/PortfolioLayout.css';
import StaticSide from './StaticSide';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';

const PortfolioLayout = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [clickRipples, setClickRipples] = useState([]);
    const [activeSection, setActiveSection] = useState('about');
    const rightPanelRef = useRef(null); // Ref to correctly target the scroll container
    const lastTimeRef = useRef(0);

    useEffect(() => {
        const handleMouseMove = (event) => {
            const now = Date.now();
            if (now - lastTimeRef.current < 16) return; // Throttle to ~60fps
            
            lastTimeRef.current = now;
            
            const x = event.clientX;
            const y = event.clientY;

            setMousePosition({ x, y });

            // Update CSS variables for global effects
            document.documentElement.style.setProperty('--cursor-x', `${x}px`);
            document.documentElement.style.setProperty('--cursor-y', `${y}px`);

            // Magnetic effect logic for hover (Wobble)
            const magneticElements = document.querySelectorAll('.magnetic-element');
            
            // Check if any magnetic element is currently hovered
            let foundHovered = false;
            magneticElements.forEach(hoveredElement => {
                const rect = hoveredElement.getBoundingClientRect();
                
                // Simplified check: is the mouse close to the element?
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    foundHovered = true;
                    const elementCenterX = rect.left + rect.width / 2;
                    const elementCenterY = rect.top + rect.height / 2;
                    const magneticX = (x - elementCenterX) / (rect.width * 2);
                    const magneticY = (y - elementCenterY) / (rect.height * 2);
                    
                    const clampedX = Math.max(-0.5, Math.min(0.5, magneticX));
                    const clampedY = Math.max(-0.5, Math.min(0.5, magneticY));
                    
                    hoveredElement.style.setProperty('--magnetic-x', clampedX);
                    hoveredElement.style.setProperty('--magnetic-y', clampedY);
                } else {
                    // Reset magnetic variables when not hovered
                    hoveredElement.style.setProperty('--magnetic-x', 0);
                    hoveredElement.style.setProperty('--magnetic-y', 0);
                }
            });

            setIsHovering(foundHovered);
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
        
        // --- Intersection Observer Setup for Scroll Highlighting ---
        const rightPanel = rightPanelRef.current;
        if (!rightPanel) return;

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    // Check if the section is intersecting AND is moving up past the threshold
                    if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                        setActiveSection(entry.target.id);
                    }
                });
            }, {
                // IMPORTANT FIX: Root must be the scrollable element
                root: rightPanel,
                // Margin controls when the state changes (e.g., when the section reaches the top 30% of the viewport)
                rootMargin: '-30% 0px -70% 0px', 
                threshold: 0.1
            }
        );

        // --- Scroll Reveal Observer Setup ---
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );


        // Initialize Observers
        ['about', 'experience', 'projects'].forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                sectionObserver.observe(section);
                // Also observe each section for the fade-in reveal
                revealObserver.observe(section); 
            }
        });
        
        // Observe individual cards/elements for reveal animation
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
    }, []); // Empty dependency array ensures it runs once on mount

    return (
        <div className="main-container">
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