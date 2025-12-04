// src/components/PortfolioLayout/PortfolioLayout.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../../styles/PortfolioLayout.css';
import StaticSide from './StaticSide';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';

const PortfolioLayout = () => {
    const [mousePosition, setMousePosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const [clickRipples, setClickRipples] = useState([]);
    const [activeSection, setActiveSection] = useState('about');
    const rightPanelRef = useRef(null); 
    const lastTimeRef = useRef(0);

    const dynamicStyles = {
        '--cursor-x': `${mousePosition.x}px`,
        '--cursor-y': `${mousePosition.y}px`,
    };

    // 🏆 Smooth Scroll Implementation
    const scrollToSection = useCallback((id) => {
        const targetElement = document.getElementById(id);
        const rightPanel = rightPanelRef.current;

        if (targetElement && rightPanel) {
            // Calculate the position of the target relative to the scrollable container
            const targetRect = targetElement.getBoundingClientRect();
            const containerRect = rightPanel.getBoundingClientRect();
            
            // Calculate the new scroll position (Target top - container top + current scroll position)
            // A slight offset (e.g., -50) can be added here if you want the section title slightly below the top edge
            const newScrollTop = targetRect.top - containerRect.top + rightPanel.scrollTop;

            rightPanel.scrollTo({
                top: newScrollTop,
                behavior: 'smooth', // This creates the smooth, professional scroll
            });
        }
    }, []);


    useEffect(() => {
        const handleMouseMove = (event) => {
            const now = Date.now();
            if (now - lastTimeRef.current < 16) return; // Throttle to ~60fps
            
            lastTimeRef.current = now;
            
            const x = event.clientX;
            const y = event.clientY;

            setMousePosition({ x, y });

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
        
        // --- Intersection Observer Setup for Scroll Highlighting ---
        const rightPanel = rightPanelRef.current;
        if (!rightPanel) return;

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                let highestRatioEntry = null;
                
                // Find the entry with the highest intersection ratio within the viewport band
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                         if (!highestRatioEntry || entry.intersectionRatio > highestRatioEntry.intersectionRatio) {
                             highestRatioEntry = entry;
                         }
                    }
                });
                
                if (highestRatioEntry) {
                    setActiveSection(highestRatioEntry.target.id);
                }
            }, {
                root: rightPanel,
                // Margin creates a restrictive band for observation
                rootMargin: '-35% 0px -65% 0px', 
                threshold: 0.01 
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
            { 
                root: rightPanel,
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
    }, [scrollToSection]); // Depend on scrollToSection for proper hook execution

    return (
        <div className="main-container" style={dynamicStyles}>
            {/* Click Ripple Effects */}
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
            
            {/* LEFT STATIC PANEL - Passing scrollToSection prop */}
            <aside className="left-panel">
                <StaticSide activeSection={activeSection} scrollToSection={scrollToSection} />
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