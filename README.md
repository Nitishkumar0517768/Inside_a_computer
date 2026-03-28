# SYS.ARCH V.01: Inside A Computer

## Concept & Design Process

**SYS.ARCH** is an immersive, high-fidelity interactive storytelling project designed to transport users deep into the micro-architecture of modern computing. Rather than resting on standard technological specifications, the user is invited to descend directly into core system components—the CPU, GPU, RAM, Storage, and Network modules—through a cinematic, scroll-driven journey.

Our conceptual goal was to build an environment that feels less like a traditional webpage and more like a premium hardware product showcase or standalone native application. To achieve this visually, the design leverages a stark, cybernetic dark mode (`#030303`) accented by neon typography, subtle CSS-driven holographic scanlines, and high-contrast text treatments. The homepage organically marries the narrative to deeply integrated 3D models (via Sketchfab masking), ensuring that the physical geometry of motherboards and graphics cards scale flawlessly across ultra-wide desktop monitors all the way down to portrait mobile screens.

Technically, building the interior module experiences pushed the boundaries of standard DOM manipulation. Instead of trying and failing to animate highly complex SVG graphics or relying on massive embedded video files, we engineered a custom frame-by-frame `HTML5 <canvas>` rendering system. Utilizing nearly 1,000 pre-rendered, high-resolution `.webp` animation frames linked globally to GSAP's `ScrollTrigger` and the `Lenis` smooth scrolling API, the website tightly binds the 3D cinematic camera movements to the physical turn of the user's mouse wheel. 

The most prominent design challenge was handling the colossal weight of these media assets without ruining the user experience. To completely eliminate 2+ minute loading blockades, a two-pronged caching strategy was designed: a silent JavaScript background loop eagerly pre-fetches all 192 frames for every single module when the user is simply reading the home page. Secondly, the component-level loading blockers were drastically reduced to only `await` the first 15 critical frames, yielding control back to the user instantly while asynchronously painting late-arriving backgrounds into the canvas on the fly.

## Technologies Used
- **Core Strategy:** Vanilla JavaScript, HTML5 Canvas, Advanced CSS Grid & Flexbox, Media Queries
- **Animation Engine:** GSAP (GreenSock Animation Platform) + ScrollTrigger, Lenis Smooth Scroll
- **Media Pipeline:** Aggressive `.webp` sequence extraction, Dynamic 3D Embeds