// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Loader and Intro Animations
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if(loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 1500);
    }

    // Hero section animations
    gsap.to('.hero-text .eyebrow', { opacity: 1, y: 0, duration: 1.5, delay: 0.5, ease: 'power4.out' });
    gsap.to('.hero-text h1', { opacity: 1, y: 0, duration: 1.5, delay: 0.8, ease: 'power4.out' });
    gsap.to('.hero-text p', { opacity: 1, y: 0, duration: 1.5, delay: 1.1, ease: 'power4.out' });
    gsap.to('.sketchfab-hero-wrapper', { opacity: 1, scale: 1, duration: 1.5, delay: 1.4, ease: 'power4.out' });
    
    // Component section scroll animations
    const sections = document.querySelectorAll('.component-section');
    sections.forEach(section => {
        const text = section.querySelector('.component-text');
        const model = section.querySelector('.component-model');

        gsap.to(text, {
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
            },
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out'
        });

        gsap.to(model, {
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
            },
            opacity: 1,
            scale: 1,
            duration: 1.2,
            delay: 0.2, // slightly staggered
            ease: 'power3.out'
        });
    });
});
