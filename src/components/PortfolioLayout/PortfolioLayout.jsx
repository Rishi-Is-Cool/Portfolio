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
    const containerRef = useRef(null);
    const particlesRef = useRef([]);
    const lastTimeRef = useRef(0);

    useEffect(() => {
        const handleMouseMove = (event) => {
            const now = Date.now();
            // Throttle mousemove events for better performance
            if (now - lastTimeRef.current < 16) return; // ~60fps
            
            lastTimeRef.current = now;
            
            const x = event.clientX;
            const y = event.clientY;

            setMousePosition({ x, y });

            // Update CSS variables for cursor glow
            document.documentElement.style.setProperty('--cursor-x', `${x}px`);
            document.documentElement.style.setProperty('--cursor-y', `${y}px`);

            // Update CSS variables for parallax (subtle depth effect)
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const parallaxX = (x - centerX) / centerX;
            const parallaxY = (y - centerY) / centerY;

            document.documentElement.style.setProperty('--parallax-x', `${parallaxX * 15}px`);
            document.documentElement.style.setProperty('--parallax-y', `${parallaxY * 15}px`);

            // Update magnetic effect for interactive elements
            if (isHovering) {
                const hoveredElement = event.target.closest('.magnetic-element');
                if (hoveredElement) {
                    const rect = hoveredElement.getBoundingClientRect();
                    const elementCenterX = rect.left + rect.width / 2;
                    const elementCenterY = rect.top + rect.height / 2;
                    const magneticX = (x - elementCenterX) / (rect.width * 2);
                    const magneticY = (y - elementCenterY) / (rect.height * 2);
                    
                    // Clamp values to prevent excessive movement
                    const clampedX = Math.max(-0.5, Math.min(0.5, magneticX));
                    const clampedY = Math.max(-0.5, Math.min(0.5, magneticY));
                    
                    hoveredElement.style.setProperty('--magnetic-x', clampedX);
                    hoveredElement.style.setProperty('--magnetic-y', clampedY);
                }
            }
        };

        const handleMouseClick = (event) => {
            // Create ripple effect on click for visual feedback
            const ripple = {
                id: Date.now(),
                x: event.clientX,
                y: event.clientY,
                size: Math.random() * 40 + 20, // Random size between 20-60px
            };
            setClickRipples(prev => [...prev, ripple]);

            // Remove ripple after animation completes
            setTimeout(() => {
                setClickRipples(prev => prev.filter(r => r.id !== ripple.id));
            }, 600);
        };

        const handleMouseEnter = (e) => {
            if (e.target.closest('.magnetic-element') || 
                e.target.closest('.project-card') || 
                e.target.closest('a') ||
                e.target.closest('button')) {
                setIsHovering(true);
                // Increase cursor size on interactive elements
                document.documentElement.style.setProperty('--cursor-scale', '1.3');
            }
        };

        const handleMouseLeave = () => {
            setIsHovering(false);
            document.documentElement.style.setProperty('--cursor-scale', '1');
        };

        // Create particle system for cursor trail
        const createParticles = () => {
            if (particlesRef.current.length > 0) return;

            const particles = [];
            for (let i = 0; i < 15; i++) {
                particles.push({
                    id: i,
                    dx: (Math.random() - 0.5) * 2,
                    dy: (Math.random() - 0.5) * 2,
                    delay: Math.random() * 2,
                    size: Math.random() * 4 + 2,
                    color: Math.random() > 0.7 ? '#8b5cf6' : (Math.random() > 0.5 ? '#6366f1' : '#3b82f6'),
                });
            }
            particlesRef.current = particles;
        };

        // Section observer for active nav highlighting
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            }, {
                root: document.querySelector('.right-panel'),
                rootMargin: '-20% 0px -70% 0px', // Trigger when section is near center
                threshold: 0.1
            }
        );

        // Scroll reveal observer for fade-in animations
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target); // Only animate once
                    }
                });
            },
            { 
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Initialize
        createParticles();

        // Observe sections for active nav highlighting
        ['about', 'experience', 'projects'].forEach(id => {
            const section = document.getElementById(id);
            if (section) sectionObserver.observe(section);
        });

        // Observe elements for scroll reveal
        document.querySelectorAll('.section-reveal').forEach(el => {
            revealObserver.observe(el);
        });

        // Add event listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleMouseClick);
        document.addEventListener('mouseover', handleMouseEnter);
        document.addEventListener('mouseout', handleMouseLeave);

        // Update cursor trail position
        const updateCursorTrail = () => {
            const trail = document.querySelector('.cursor-trail');
            if (trail) {
                trail.style.left = `${mousePosition.x}px`;
                trail.style.top = `${mousePosition.y}px`;
            }
        };

        // Animation frame for smooth trail
        let animationFrameId;
        const animate = () => {
            updateCursorTrail();
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            // Cleanup
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleMouseClick);
            document.removeEventListener('mouseover', handleMouseEnter);
            document.removeEventListener('mouseout', handleMouseLeave);
            
            sectionObserver.disconnect();
            revealObserver.disconnect();
            
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isHovering, mousePosition.x, mousePosition.y]);

    const dynamicStyles = {
        '--cursor-x': `${mousePosition.x}px`,
        '--cursor-y': `${mousePosition.y}px`,
    };

    return (
        <div 
            ref={containerRef}
            className="main-container" 
            style={dynamicStyles}
        >
            {/* Cursor Trail Element */}
            <div 
                className="cursor-trail"
                style={{
                    left: mousePosition.x,
                    top: mousePosition.y,
                }}
            />
            
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
            
            {/* Animated Particles for Cursor Trail */}
            <div className="cursor-particles">
                {particlesRef.current.map(particle => (
                    <div
                        key={particle.id}
                        className="cursor-particle"
                        style={{
                            '--particle-dx': particle.dx,
                            '--particle-dy': particle.dy,
                            left: mousePosition.x,
                            top: mousePosition.y,
                            animationDelay: `${particle.delay}s`,
                            width: particle.size,
                            height: particle.size,
                            backgroundColor: particle.color,
                        }}
                    />
                ))}
            </div>
            
            {/* Parallax Background Layers */}
            <div className="parallax-layer parallax-layer-1" />
            <div className="parallax-layer parallax-layer-2" />
            <div className="grid-overlay" />

            {/* LEFT STATIC PANEL */}
            <aside className="left-panel">
                <StaticSide activeSection={activeSection} />
            </aside>

            {/* RIGHT SCROLLABLE PANEL */}
            <main className="right-panel">
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
                    height: '5rem', 
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '4rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '2rem'
                }}>
                    <span className="magnetic-element" style={{ padding: '1rem 2rem' }}>
                        © 2025 Rishikesh Patil | Built with React + Vite & CSS
                    </span>
                </footer>
            </main>
        </div>
    );
};

export default PortfolioLayout;