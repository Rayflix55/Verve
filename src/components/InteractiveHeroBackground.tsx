import React, { useEffect, useRef } from 'react';

export function InteractiveHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Smooth cursor coordinate tracking
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false,
    };

    // Lightweight Particle structure
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      baseAlpha: number;
      colorIndex: number;
    }

    const particleCount = 40; // Extremely lightweight
    const particles: Particle[] = [];

    const colorsLight = [
      'rgba(233, 30, 99, ',   // Magenta
      'rgba(156, 39, 176, ',  // Purple
      'rgba(0, 188, 212, ',   // Cyan
    ];

    const colorsDark = [
      'rgba(244, 63, 94, ',   // Rose/Pink
      'rgba(168, 85, 247, ',  // Purple
      'rgba(6, 182, 212, ',   // Cyan
    ];

    // Helper to spawn a single particle
    const createParticle = (initRandom = false): Particle => {
      const radius = Math.random() * 2 + 1;
      const baseAlpha = Math.random() * 0.2 + 0.15;
      return {
        x: initRandom ? Math.random() * width : (mouse.active ? mouse.x : Math.random() * width),
        y: initRandom ? Math.random() * height : (mouse.active ? mouse.y : Math.random() * height),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.1, // Slight upward drift
        radius,
        alpha: baseAlpha,
        baseAlpha,
        colorIndex: Math.floor(Math.random() * 3),
      };
    };

    // Pre-populate particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse movement inside Hero bounds
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    // Attach mouse listeners to the parent section
    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    // Performance enhancement: Only animate if visible in viewport
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Render loop
    const animate = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Check dark mode state dynamically on each frame to adjust palette
      const isDark = document.documentElement.classList.contains('dark');
      const palette = isDark ? colorsDark : colorsLight;

      // Smoothly interpolate current mouse to target mouse coordinates (Lerp)
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        // Draw a highly subtle interactive localized glow aura around the interpolated cursor coordinates
        const radialGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 140
        );
        if (isDark) {
          radialGlow.addColorStop(0, 'rgba(168, 85, 247, 0.05)');
          radialGlow.addColorStop(1, 'rgba(168, 85, 247, 0)');
        } else {
          radialGlow.addColorStop(0, 'rgba(233, 30, 99, 0.04)');
          radialGlow.addColorStop(1, 'rgba(233, 30, 99, 0)');
        }
        ctx.fillStyle = radialGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw and update lightweight particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift
        p.x += p.vx;
        p.y += p.vy;

        // Gently gravitate/pull towards the smooth mouse cursor position if nearby
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 220) {
            // Apply slight interactive attraction force
            const force = (220 - dist) / 22000;
            p.vx += dx * force;
            p.vy += dy * force;

            // Increase particle opacity dynamically based on mouse proximity
            p.alpha = p.baseAlpha + (1 - dist / 220) * 0.35;
          } else {
            // Return to base opacity smoothly
            p.alpha += (p.baseAlpha - p.alpha) * 0.1;
          }
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.1;
        }

        // Keep velocity clamped for organic feel
        const maxSpeed = 1.2;
        const currentSpeed = Math.hypot(p.vx, p.vy);
        if (currentSpeed > maxSpeed) {
          p.vx = (p.vx / currentSpeed) * maxSpeed;
          p.vy = (p.vy / currentSpeed) * maxSpeed;
        }

        // Draw particle
        ctx.fillStyle = `${palette[p.colorIndex]}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Bounce/Re-wrap particles off bounds
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          particles[i] = createParticle(false);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-15 pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
