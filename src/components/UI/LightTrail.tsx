import React, { useEffect, useRef } from 'react';
import { useIsMobile, useReducedMotion } from '../../hooks/useMobileOptimizedMotion';

interface TrailNode {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
}

export function LightTrail() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = isMobile || prefersReducedMotion;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const targetMouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  
  // Track currently hovered card and its bounding rectangle
  const activeCardRef = useRef<{ element: HTMLElement; rect: DOMRect } | null>(null);
  const hoverIntensityRef = useRef<number>(0); // Lerps between 0 and 1

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Handle resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Node count and history
    const nodes: TrailNode[] = [];
    const maxNodes = 32;

    // Sparkles when moving over cards
    const sparkles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      life: number;
      maxLife: number;
    }> = [];

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Check if mouse is over a premium glow card
      const card = (e.target as HTMLElement).closest('.premium-glow-card') as HTMLElement;
      if (card) {
        activeCardRef.current = {
          element: card,
          rect: card.getBoundingClientRect(),
        };
      } else {
        activeCardRef.current = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Initialize nodes
    for (let i = 0; i < maxNodes; i++) {
      nodes.push({
        x: -1000,
        y: -1000,
        size: 0,
        alpha: 0,
        color: '',
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smoothly interpolate current cursor coordinate to targets
      const dx = targetMouseRef.current.x - mouseRef.current.x;
      const dy = targetMouseRef.current.y - mouseRef.current.y;
      
      // High responsiveness speed
      mouseRef.current.x += dx * 0.25;
      mouseRef.current.y += dy * 0.25;

      // Update active card bounds if it's currently hovered (handles scroll and resize smoothly)
      if (activeCardRef.current) {
        activeCardRef.current.rect = activeCardRef.current.element.getBoundingClientRect();
      }

      // Lerp hover intensity based on whether a card is hovered
      const targetHoverIntensity = activeCardRef.current ? 1.0 : 0.0;
      hoverIntensityRef.current += (targetHoverIntensity - hoverIntensityRef.current) * 0.12;

      const hoverProgress = hoverIntensityRef.current;
      const cardData = activeCardRef.current;

      // Update head of trail
      const head = nodes[0];
      if (cardData && hoverProgress > 0.05) {
        // Converge trail head slightly towards the closest border point or center of the card
        const rect = cardData.rect;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Gravity pull factor (converges particles towards the card center/surface)
        const pullX = centerX;
        const pullY = centerY;

        head.x += (pullX - head.x) * 0.15 * hoverProgress;
        head.y += (pullY - head.y) * 0.15 * hoverProgress;
        
        // Also keep following the mouse but with strong magnet attraction
        head.x += (mouseRef.current.x - head.x) * (1 - 0.15 * hoverProgress);
        head.y += (mouseRef.current.y - head.y) * (1 - 0.15 * hoverProgress);
      } else {
        head.x = mouseRef.current.x;
        head.y = mouseRef.current.y;
      }

      // Update following nodes with a progressive spring delay
      for (let i = 1; i < maxNodes; i++) {
        const prev = nodes[i - 1];
        const curr = nodes[i];
        
        const followSpeed = 0.45 - (i / maxNodes) * 0.25; // outer points have more drag

        if (cardData && hoverProgress > 0.1) {
          // When over card, trailing nodes converge and pack tighter
          const rect = cardData.rect;
          // Calculate a point on the perimeter of the card to wrap it
          const angle = (i / maxNodes) * Math.PI * 2 + (performance.now() * 0.002);
          const borderX = rect.left + rect.width / 2 + (rect.width / 2 + 10) * Math.cos(angle);
          const borderY = rect.top + rect.height / 2 + (rect.height / 2 + 10) * Math.sin(angle);

          // Blend standard following behavior with card border wrapping/convergence
          curr.x += (prev.x - curr.x) * followSpeed * (1 - hoverProgress * 0.5);
          curr.y += (prev.y - curr.y) * followSpeed * (1 - hoverProgress * 0.5);

          curr.x += (borderX - curr.x) * 0.08 * hoverProgress;
          curr.y += (borderY - curr.y) * 0.08 * hoverProgress;
        } else {
          curr.x += (prev.x - curr.x) * followSpeed;
          curr.y += (prev.y - curr.y) * followSpeed;
        }
      }

      // Spawn subtle glowing sparkles when moving quickly or when hover is active
      const mouseSpeed = Math.sqrt(dx * dx + dy * dy);
      if ((mouseSpeed > 3 && Math.random() < 0.4) || (cardData && Math.random() < 0.25)) {
        const spawnX = cardData && hoverProgress > 0.5 
          ? cardData.rect.left + Math.random() * cardData.rect.width
          : mouseRef.current.x;
        const spawnY = cardData && hoverProgress > 0.5 
          ? cardData.rect.top + Math.random() * cardData.rect.height
          : mouseRef.current.y;

        const maxLife = 30 + Math.random() * 30;
        sparkles.push({
          x: spawnX,
          y: spawnY,
          vx: (Math.random() - 0.5) * (cardData ? 1.5 : 3.0),
          vy: (Math.random() - 0.5) * (cardData ? 1.5 : 3.0) - (cardData ? 0.3 : 0), // drift slightly upward on cards
          size: 1.0 + Math.random() * 2.0,
          alpha: 0.8,
          color: Math.random() > 0.5 ? '#E91E63' : '#00BCD4', // Magenta or Cyan
          life: maxLife,
          maxLife,
        });
      }

      // Draw global gradient light trail line
      if (nodes[0].x > -500) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Set global composite operation to screen/lighter for professional high-end bioluminescent blend
        ctx.globalCompositeOperation = 'screen';

        // Draw multiple passes for high quality volumetric lighting
        const passes = [
          { width: 32, alpha: 0.03 },
          { width: 14, alpha: 0.06 },
          { width: 5, alpha: 0.15 },
        ];

        passes.forEach((pass) => {
          ctx.beginPath();
          ctx.moveTo(nodes[0].x, nodes[0].y);

          for (let i = 1; i < maxNodes - 1; i++) {
            // Draw smooth quadratic bezier curve between nodes
            const xc = (nodes[i].x + nodes[i + 1].x) / 2;
            const yc = (nodes[i].y + nodes[i + 1].y) / 2;
            ctx.quadraticCurveTo(nodes[i].x, nodes[i].y, xc, yc);
          }

          ctx.lineWidth = pass.width * (1.0 + hoverProgress * 0.8); // Intensify width when hovering cards
          
          // Gradient containing brand colors
          const grad = ctx.createLinearGradient(nodes[0].x, nodes[0].y, nodes[maxNodes - 1].x, nodes[maxNodes - 1].y);
          // When over card, colors intensify/brighten
          const magentaColor = `rgba(233, 30, 99, ${pass.alpha * (1.0 + hoverProgress * 1.5)})`;
          const cyanColor = `rgba(0, 188, 212, ${pass.alpha * (1.0 + hoverProgress * 1.5)})`;
          
          grad.addColorStop(0, magentaColor);
          grad.addColorStop(0.5, cyanColor);
          grad.addColorStop(1, 'rgba(156, 39, 176, 0)'); // fade out to transparent purple

          ctx.strokeStyle = grad;
          ctx.stroke();
        });
      }

      // Draw and update sparkles
      ctx.globalCompositeOperation = 'screen';
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life--;

        // Fade out
        s.alpha = (s.life / s.maxLife) * 0.7;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (1.0 + hoverProgress * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.fill();

        if (s.life <= 0) {
          sparkles.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shouldReduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
      style={{ zIndex: -10 }}
      id="cursor-light-trail-canvas"
    />
  );
}
