// app.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });
    lenis.on("scroll", (e) => {
        ScrollTrigger.update();
        document.documentElement.style.setProperty('--scrollY', window.scrollY + 'px');
    });
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Context & Elements
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    
    // Video Properties
    const FRAME_COUNT = 192; // Analyzed via ffprobe
    const IMAGE_SCALE = 1.15; 
    const FRAME_SPEED = 1.0; 
    let currentFrame = -1;
    const frames = [];
    let bgColor = "#000000";

    let lastWidth = -1;
    function resize() {
        if (window.innerWidth !== lastWidth) {
            lastWidth = window.innerWidth;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            if (currentFrame >= 0 && frames[currentFrame]) {
                drawFrame(currentFrame);
            }
        }
    }
    window.addEventListener("resize", resize);
    resize();

    const loadFrames = async () => {
        const pad = (num, size) => ('000' + num).slice(-size);
        for (let i = 1; i <= FRAME_COUNT; i++) {
            await loadImage(i, pad(i, 4));
            updateLoader(i);
        }
        gsap.to("#loader", { yPercent: -100, duration: 1, ease: "power3.inOut" });
    };

    function loadImage(index, paddedStr) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                frames[index - 1] = img;
                if (index === 1) { 
                    sampleBgColor(img);
                    drawFrame(0);
                }
                resolve();
            };
            img.onerror = () => resolve(); 
            img.src = `../Storage_Experience/frames/frame_${paddedStr}.webp`;
        });
    }

    const bootMessages = [
        "> Resolving binary matrices...",
        "> Allocating core memory buffers...",
        "> Decoding visual sectors...",
        "> Synchronizing clock cycles...",
        "> Bypassing security firewalls...",
        "> Initializing micro-components...",
        "> Establishing root access...",
        "> Compiling hardware signatures...",
        "> SYSTEM ONLINE."
    ];

    function updateLoader(loaded) {
        const percent = Math.floor((loaded / FRAME_COUNT) * 100); 
        document.getElementById("loader-bar").style.width = `${percent}%`;
        document.getElementById("loader-percent").textContent = percent;
        
        if (loaded % Math.ceil(FRAME_COUNT / bootMessages.length) === 0 || loaded === 1) {
            const msgIndex = Math.min(Math.floor((loaded / FRAME_COUNT) * bootMessages.length), bootMessages.length - 1);
            const logContainer = document.getElementById("boot-logs");
            if (logContainer) {
                const msg = bootMessages[msgIndex];
                const div = document.createElement("div");
                div.textContent = msg;
                logContainer.appendChild(div);
                if (logContainer.children.length > 3) {
                    logContainer.removeChild(logContainer.firstChild);
                }
            }
        }
    }

    function sampleBgColor(img) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = 10;
        tempCanvas.height = 10;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(img, 0, 0, 10, 10);
        const pixelData = tempCtx.getImageData(0, 0, 1, 1).data;
        bgColor = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
    }

    function drawFrame(index) {
        const img = frames[index];
        if (!img) return;
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        
        const isMobile = window.innerWidth < 768;
        // Mobile uses Math.min to fit width widthout severe zooming. Desktop uses Math.max to cover screen.
        const scale = isMobile 
            ? Math.min(cw / iw, ch / ih) * 1.05 
            : Math.max(cw / iw, ch / ih) * IMAGE_SCALE;
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (cw - dw) / 2;
        const dy = (ch - dh) / 2;
        
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, dw, dh);
        
        if (index % 30 === 0) sampleBgColor(img);
    }

    const scrollContainer = document.getElementById("scroll-container");
    ScrollTrigger.create({
        trigger: scrollContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
            const accelerated = Math.min(self.progress * FRAME_SPEED, 1);
            let index = Math.floor(accelerated * FRAME_COUNT);
            if (index >= FRAME_COUNT) index = FRAME_COUNT - 1;
            
            if (index !== currentFrame) {
                currentFrame = index;
                requestAnimationFrame(() => drawFrame(currentFrame));
            }
        }
    });

    const heroSection = document.querySelector(".hero-standalone");
    const canvasWrap = document.querySelector(".canvas-wrap");
    
    canvasWrap.style.clipPath = `polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)`;

    ScrollTrigger.create({
        trigger: scrollContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
            const p = self.progress;
            heroSection.style.opacity = Math.max(0, 1 - p * 15);
            const wipeProgress = Math.min(1, Math.max(0, (p - 0.01) / 0.06));
            const easeWipe = 1 - Math.pow(1 - wipeProgress, 3);
            const percent = easeWipe * 50; 
            canvasWrap.style.clipPath = `polygon(0% ${50 - percent}%, 100% ${50 - percent}%, 100% ${50 + percent}%, 0% ${50 + percent}%)`;
        }
    });

    document.querySelectorAll(".scroll-section").forEach(section => {
        const enter = parseFloat(section.dataset.enter) / 100;
        const leave = parseFloat(section.dataset.leave) / 100;
        const midPoint = enter + (leave - enter) / 2;
        
        section.style.top = `${midPoint * 100}%`;
        section.style.transform = `translateY(-50%)`;

        setupSectionAnimation(section, enter, leave);
    });

    function setupSectionAnimation(section, enter, leave) {
        const type = section.dataset.animation;
        const persist = section.dataset.persist === "true";
        const children = section.querySelectorAll(
            ".section-label, .section-heading, .section-body, .cta-button, .stat"
        );

        const tl = gsap.timeline({ paused: true });

        switch (type) {
            case "fade-up": tl.from(children, { y: 50, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" }); break;
            case "slide-left": tl.from(children, { x: -80, opacity: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" }); break;
            case "slide-right": tl.from(children, { x: 80, opacity: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" }); break;
            case "scale-up": tl.from(children, { scale: 0.85, opacity: 0, stagger: 0.12, duration: 1.0, ease: "power2.out" }); break;
            case "stagger-up": tl.from(children, { y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }); break;
            case "clip-reveal": tl.from(children, { clipPath: "inset(100% 0 0 0)", opacity: 0, stagger: 0.15, duration: 1.2, ease: "power4.inOut" }); break;
        }
        
        ScrollTrigger.create({
            trigger: scrollContainer,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
                const p = self.progress;
                if (p >= enter && p <= leave) {
                    if (tl.progress() === 0) tl.play();
                } else if (p < enter) {
                    if (tl.progress() > 0) tl.reverse();
                } else if (p > leave && !persist) {
                    if (tl.progress() > 0) tl.reverse();
                }
            }
        });
    }

    document.querySelectorAll(".stat-number").forEach(el => {
        const target = parseFloat(el.dataset.value);
        const decimals = parseInt(el.dataset.decimals || "0");
        const section = el.closest(".scroll-section");
        const enter = parseFloat(section.dataset.enter) / 100;
        
        ScrollTrigger.create({
            trigger: scrollContainer,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                if (self.progress >= enter && el.textContent == "0") {
                    gsap.to(el, {
                        innerHTML: target,
                        duration: 2,
                        ease: "power1.out",
                        snap: { innerHTML: decimals === 0 ? 1 : 0.01 }
                    });
                } else if (self.progress < enter - 0.05) {
                    el.innerHTML = "0";
                }
            }
        });
    });

    document.querySelectorAll(".marquee-wrap").forEach(el => {
        const speed = parseFloat(el.dataset.scrollSpeed) || -25;
        
        gsap.to(el.querySelector(".marquee-text"), {
            xPercent: speed,
            ease: "none",
            scrollTrigger: { trigger: scrollContainer, start: "top top", end: "bottom bottom", scrub: true }
        });

        ScrollTrigger.create({
            trigger: scrollContainer,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
                const p = self.progress;
                if (p > 0.1 && p < 0.4) {
                    el.style.opacity = Math.min(1, (p - 0.1) * 10);
                } else if (p >= 0.4 && p < 0.45) {
                    el.style.opacity = Math.max(0, 1 - (p - 0.4) * 20);
                } else {
                    el.style.opacity = 0;
                }
            }
        });
    });

    const overlay = document.getElementById("dark-overlay");
    const fadeRange = 0.04;
    const statsEnter = 0.40;
    const statsLeave = 0.55;

    ScrollTrigger.create({
        trigger: scrollContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
            const p = self.progress;
            let opacity = 0;
            if (p >= statsEnter - fadeRange && p <= statsEnter) {
                opacity = (p - (statsEnter - fadeRange)) / fadeRange;
            } else if (p > statsEnter && p < statsLeave) {
                opacity = 0.2;
            } else if (p >= statsLeave && p <= statsLeave + fadeRange) {
                opacity = 0.2 * (1 - (p - statsLeave) / fadeRange);
            }
            overlay.style.opacity = opacity;
        }
    });

    loadFrames();
});
