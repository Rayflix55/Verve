import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, Sparkles, RefreshCw, Zap, Monitor, Activity, Check, CirclePlay, CirclePause, ChevronRight, Info } from 'lucide-react';
import { useIsMobile, useReducedMotion } from '../hooks/useMobileOptimizedMotion';

// Interfaces for our configuration
interface ColorPreset {
  name: string;
  bg: [number, number, number];
  c1: [number, number, number];
  c2: [number, number, number];
  c3: [number, number, number];
  c4: [number, number, number];
  hexColors: string[];
}

const PRESETS: Record<string, ColorPreset> = {
  cyberpunk: {
    name: 'Neon Cyberpunk',
    bg: [0.0, 0.0, 0.0],
    c1: [0.85, 0.17, 0.94], // #D946EF Magenta
    c2: [0.55, 0.26, 0.96], // #8B5CF6 Purple
    c3: [0.39, 0.30, 0.95], // #6366F1 Indigo
    c4: [0.10, 0.80, 0.90], // Cyan highlight
    hexColors: ['#000000', '#D946EF', '#8B5CF6', '#6366F1', '#22D3EE'],
  },
  cosmic: {
    name: 'Cosmic Nebula',
    bg: [0.02, 0.02, 0.05],
    c1: [0.05, 0.40, 0.95], // Blue
    c2: [0.50, 0.05, 0.85], // Purple-indigo
    c3: [0.90, 0.10, 0.45], // Hot fuchsia
    c4: [0.05, 0.70, 0.50], // Emerald glow
    hexColors: ['#05050D', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981'],
  },
  toxic: {
    name: 'Acid Protocol',
    bg: [0.0, 0.02, 0.01],
    c1: [0.05, 0.85, 0.30], // Lime green
    c2: [0.0, 0.60, 0.80],  // Teal
    c3: [0.40, 0.10, 0.70], // Violet
    c4: [0.80, 0.90, 0.10], // Toxic yellow
    hexColors: ['#000502', '#22C55E', '#06B6D4', '#7C3AED', '#EAB308'],
  },
  solar: {
    name: 'Solar Flare',
    bg: [0.04, 0.01, 0.0],
    c1: [0.95, 0.25, 0.10], // Vermilion
    c2: [0.90, 0.60, 0.05], // Amber
    c3: [0.95, 0.10, 0.50], // Deep pink
    c4: [0.50, 0.0, 0.30],  // Dark plum
    hexColors: ['#0A0200', '#EF4444', '#F59E0B', '#EC4899', '#701A75'],
  }
};

interface TrailPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
}

export function InteractiveAnimatedBackground() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = isMobile || prefersReducedMotion;

  // Config States
  const [speed, setSpeed] = useState<number>(0.8);
  const [warpStrength, setWarpStrength] = useState<number>(1.2);
  const [glowRadius, setGlowRadius] = useState<number>(12.0); // mapped to falloff
  const [noiseIntensity, setNoiseIntensity] = useState<number>(0.03);
  const [blobCount, setBlobCount] = useState<number>(4);
  const [viscosity, setViscosity] = useState<number>(0.92); // Trail fade inertia
  const [activePreset, setActivePreset] = useState<string>('cyberpunk');
  const [qualityScale, setQualityScale] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      return isMobile ? 0.45 : 0.75;
    }
    return 0.75;
  }); // downscale for performance
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [autopilot, setAutopilot] = useState<boolean>(true);
  const [renderEngine, setRenderEngine] = useState<'webgl' | 'canvas2d'>(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      return isMobile ? 'canvas2d' : 'webgl';
    }
    return 'webgl';
  });

  // Interactive Panel States
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailsRef = useRef<TrailPoint[]>([]);
  const lastMouseRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const requestRef = useRef<number | null>(null);
  const fpsIntervalRef = useRef<{ lastTime: number; frames: number }>({ lastTime: 0, frames: 0 });
  const shaderParamsRef = useRef({
    time: 0,
    speed,
    warpStrength,
    glowRadius,
    noiseIntensity,
    blobCount,
    viscosity,
  });

  // Sync refs with state for immediate shader update without tearing
  useEffect(() => {
    shaderParamsRef.current = {
      time: shaderParamsRef.current.time,
      speed,
      warpStrength,
      glowRadius,
      noiseIntensity,
      blobCount,
      viscosity,
    };
  }, [speed, warpStrength, glowRadius, noiseIntensity, blobCount, viscosity]);

  // Autopilot simulation coordinates
  const autopilotAngleRef = useRef<number>(0);

  // Reset function
  const handleReset = () => {
    setSpeed(0.8);
    setWarpStrength(1.2);
    setGlowRadius(12.0);
    setNoiseIntensity(0.03);
    setBlobCount(4);
    setViscosity(0.92);
    setActivePreset('cyberpunk');
    setQualityScale(0.75);
    setAutopilot(true);
  };

  // Mouse Movement Handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPaused) return;
      if (autopilot) {
        setAutopilot(false); // Cancel autopilot on real interaction
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const now = performance.now();
      const dt = Math.max(1, now - lastMouseRef.current.time);
      
      const vx = (x - lastMouseRef.current.x) / (dt / 16.6); // normalized velocity
      const vy = (y - lastMouseRef.current.y) / (dt / 16.6);

      // Avoid creating trails when cursor is static
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > 0.001) {
        trailsRef.current.push({ x, y, vx, vy, age: 1.0 });
        if (trailsRef.current.length > 16) {
          trailsRef.current.shift();
        }
      }

      lastMouseRef.current = { x, y, time: now };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPaused, autopilot]);

  // Main Loop / Renderer
  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    let ctx2d: CanvasRenderingContext2D | null = null;

    // Shader vars
    let program: WebGLProgram | null = null;
    let positionBuffer: WebGLBuffer | null = null;

    // Setup Rendering Engines
    if (renderEngine === 'webgl') {
      gl = canvas.getContext('webgl', { alpha: false, depth: false, antialias: false });
      if (!gl) {
        console.warn('WebGL failed to initialize. Falling back to Canvas 2D.');
        setRenderEngine('canvas2d');
        return;
      }
    } else {
      ctx2d = canvas.getContext('2d');
    }

    // WebGL Shader Compilation helper functions
    const createShader = (glContext: WebGLRenderingContext, type: number, source: string) => {
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error('Shader compile error:', glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const initWebGL = () => {
      if (!gl) return false;

      // Vertex Shader Source
      const vsSource = `
        attribute vec2 position;
        varying vec2 v_uv;
        void main() {
          v_uv = position * 0.5 + 0.5;
          v_uv.y = 1.0 - v_uv.y; // Match canvas coord space
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      // Fragment Shader Source
      const fsSource = `
        precision highp float;
        varying vec2 v_uv;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_speed;
        uniform float u_warp_strength;
        uniform float u_glow_radius;
        uniform float u_noise_intensity;
        uniform int u_blob_count;

        // Mouse trails
        uniform vec2 u_trail_pos[16];
        uniform vec2 u_trail_vel[16];
        uniform float u_trail_age[16];
        uniform int u_trail_count;

        // Colors
        uniform vec3 u_color_bg;
        uniform vec3 u_color1;
        uniform vec3 u_color2;
        uniform vec3 u_color3;
        uniform vec3 u_color4;

        // Simple pseudo-random generator for grain
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        void main() {
          vec2 uv = v_uv;
          vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
          vec2 uv_aspect = uv * aspect;
          
          // Apply interactive fluid displacement from trails
          vec2 displacement = vec2(0.0);
          
          for (int i = 0; i < 16; i++) {
            if (i >= u_trail_count) break;
            
            vec2 trail_pos = u_trail_pos[i];
            vec2 trail_vel = u_trail_vel[i];
            float age = u_trail_age[i];
            
            vec2 d = uv - trail_pos;
            vec2 d_aspect = d * aspect;
            float dist = length(d_aspect);
            
            float radius = 0.28; // Interaction radius
            if (dist < radius) {
              // Smoothly fade out near borders
              float intensity = 1.0 - (dist / radius);
              float smooth_intensity = smoothstep(0.0, 1.0, intensity);
              float force = smooth_intensity * age * u_warp_strength;
              
              // Swirling vortex perpendicular to d
              vec2 swirl = vec2(-d.y, d.x);
              
              // Pushing wake in direction of trail_vel
              vec2 push = trail_vel;
              
              displacement += (swirl * 1.6 + push * 0.9) * force;
            }
          }
          
          vec2 uv_distorted = uv + displacement;
          
          // Define 5 blobs animated organically
          float t = u_time * u_speed;
          
          vec2 centers[5];
          centers[0] = vec2(0.3 + 0.18 * sin(t * 0.45), 0.4 + 0.15 * cos(t * 0.35));
          centers[1] = vec2(0.7 + 0.16 * cos(t * 0.55), 0.6 + 0.18 * sin(t * 0.30));
          centers[2] = vec2(0.5 + 0.22 * sin(t * 0.35), 0.3 + 0.14 * sin(t * 0.50));
          centers[3] = vec2(0.2 + 0.14 * cos(t * 0.60), 0.7 + 0.20 * sin(t * 0.25));
          centers[4] = vec2(0.8 + 0.12 * sin(t * 0.50), 0.2 + 0.15 * cos(t * 0.40));
          
          vec3 colors[5];
          colors[0] = u_color1;
          colors[1] = u_color2;
          colors[2] = u_color3;
          colors[3] = u_color4;
          colors[4] = u_color1 * 0.5 + u_color2 * 0.5;
          
          vec3 final_color = u_color_bg;
          float total_glow = 0.0;
          
          for (int i = 0; i < 5; i++) {
            if (i >= u_blob_count) break;
            
            vec2 center = centers[i];
            vec2 d = uv_distorted - center;
            vec2 d_aspect = d * aspect;
            float dist = length(d_aspect);
            
            // Exponential falloff for gorgeous volumetric glow
            float glow = exp(-dist * dist * u_glow_radius);
            final_color += colors[i] * glow;
            total_glow += glow;
          }
          
          // Soft outer vignette
          vec2 vign_uv = uv * (1.0 - uv.yx);
          float vignette = vign_uv.x * vign_uv.y * 15.0;
          vignette = clamp(pow(vignette, 0.45), 0.0, 1.0);
          final_color *= vignette;
          
          // Subtle analogue noise grain to eliminate WebGL banding
          float grain = (random(uv_distorted + fract(u_time)) - 0.5) * u_noise_intensity;
          final_color += vec3(grain);
          
          // Dynamic glow boosting with curves
          final_color = max(final_color, vec3(0.0));
          final_color = pow(final_color, vec3(1.1));
          
          gl_FragColor = vec4(final_color, 1.0);
        }
      `;

      const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
      if (!vs || !fs) return false;

      program = gl.createProgram();
      if (!program) return false;

      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return false;
      }

      // Set up simple fullscreen quad buffer
      const vertices = new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]);

      positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      return true;
    };

    const isWebGLReady = renderEngine === 'webgl' ? initWebGL() : false;

    // Track active times
    let lastTime = performance.now();
    fpsIntervalRef.current = { lastTime: lastTime, frames: 0 };

    const render = (timeMs: number) => {
      // Calculate delta time
      const dt = (timeMs - lastTime) / 1000;
      lastTime = timeMs;

      // FPS tracking (smoothed)
      fpsIntervalRef.current.frames++;
      if (timeMs - fpsIntervalRef.current.lastTime >= 1000) {
        setFps(Math.round((fpsIntervalRef.current.frames * 1000) / (timeMs - fpsIntervalRef.current.lastTime)));
        fpsIntervalRef.current.lastTime = timeMs;
        fpsIntervalRef.current.frames = 0;
      }

      // Handle Resizing (Debounced / Scaled dynamically)
      const dpr = window.devicePixelRatio || 1;
      const targetWidth = Math.floor(window.innerWidth * qualityScale);
      const targetHeight = Math.floor(window.innerHeight * qualityScale);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        if (gl) {
          gl.viewport(0, 0, targetWidth, targetHeight);
        }
      }

      // Increment clock for fluid simulation
      if (!isPaused) {
        shaderParamsRef.current.time += dt;
      }

      // Simulate Autopilot Mouse movements if enabled
      if (autopilot && !isPaused) {
        autopilotAngleRef.current += dt * 0.7;
        const aspect = window.innerWidth / window.innerHeight;
        // Float in figure-8 infinity loop
        const x = 0.5 + 0.3 * Math.sin(autopilotAngleRef.current * 2.0);
        const y = 0.5 + 0.25 * Math.sin(autopilotAngleRef.current * 1.3) * Math.cos(autopilotAngleRef.current);

        // Map velocities
        const vx = 0.015 * Math.cos(autopilotAngleRef.current * 2.0);
        const vy = 0.012 * Math.sin(autopilotAngleRef.current * 0.8);

        trailsRef.current.push({ x, y, vx, vy, age: 1.0 });
        if (trailsRef.current.length > 16) {
          trailsRef.current.shift();
        }
      }

      // Dampen mouse trail points
      trailsRef.current.forEach((point) => {
        point.age *= viscosity; // Decay
        point.x += point.vx * 0.1; // Settle/Drift
        point.y += point.vy * 0.1;
      });

      // Filter out completely faded trails
      trailsRef.current = trailsRef.current.filter((p) => p.age > 0.01);

      // Rendering logic
      const preset = PRESETS[activePreset];

      if (renderEngine === 'webgl' && gl && program) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        // Bind vertices
        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Uniform mappings
        gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.height);
        gl.uniform1f(gl.getUniformLocation(program, 'u_time'), shaderParamsRef.current.time);
        gl.uniform1f(gl.getUniformLocation(program, 'u_speed'), shaderParamsRef.current.speed);
        gl.uniform1f(gl.getUniformLocation(program, 'u_warp_strength'), shaderParamsRef.current.warpStrength);
        gl.uniform1f(gl.getUniformLocation(program, 'u_glow_radius'), shaderParamsRef.current.glowRadius);
        gl.uniform1f(gl.getUniformLocation(program, 'u_noise_intensity'), shaderParamsRef.current.noiseIntensity);
        gl.uniform1i(gl.getUniformLocation(program, 'u_blob_count'), shaderParamsRef.current.blobCount);

        // Colors
        gl.uniform3fv(gl.getUniformLocation(program, 'u_color_bg'), preset.bg);
        gl.uniform3fv(gl.getUniformLocation(program, 'u_color1'), preset.c1);
        gl.uniform3fv(gl.getUniformLocation(program, 'u_color2'), preset.c2);
        gl.uniform3fv(gl.getUniformLocation(program, 'u_color3'), preset.c3);
        gl.uniform3fv(gl.getUniformLocation(program, 'u_color4'), preset.c4);

        // Set trail points uniforms
        const trailCount = trailsRef.current.length;
        gl.uniform1i(gl.getUniformLocation(program, 'u_trail_count'), trailCount);

        if (trailCount > 0) {
          const trailPositions = new Float32Array(32);
          const trailVelocities = new Float32Array(32);
          const trailAges = new Float32Array(16);

          for (let i = 0; i < 16; i++) {
            if (i < trailCount) {
              const p = trailsRef.current[i];
              trailPositions[i * 2] = p.x;
              trailPositions[i * 2 + 1] = p.y;
              trailVelocities[i * 2] = p.vx;
              trailVelocities[i * 2 + 1] = p.vy;
              trailAges[i] = p.age;
            } else {
              trailPositions[i * 2] = 0;
              trailPositions[i * 2 + 1] = 0;
              trailVelocities[i * 2] = 0;
              trailVelocities[i * 2 + 1] = 0;
              trailAges[i] = 0;
            }
          }

          gl.uniform2fv(gl.getUniformLocation(program, 'u_trail_pos'), trailPositions);
          gl.uniform2fv(gl.getUniformLocation(program, 'u_trail_vel'), trailVelocities);
          gl.uniform1fv(gl.getUniformLocation(program, 'u_trail_age'), trailAges);
        }

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else if (ctx2d) {
        // Fallback Canvas 2D Glowing Blobs logic for extreme low-end/no WebGL context
        ctx2d.fillStyle = `rgb(${Math.floor(preset.bg[0]*255)}, ${Math.floor(preset.bg[1]*255)}, ${Math.floor(preset.bg[2]*255)})`;
        ctx2d.fillRect(0, 0, canvas.width, canvas.height);

        // Simulate 4 drifting organic blobs
        const t = shaderParamsRef.current.time * speed;
        const centers = [
          { x: 0.3 + 0.18 * Math.sin(t * 0.45), y: 0.4 + 0.15 * Math.cos(t * 0.35), col: preset.hexColors[1] },
          { x: 0.7 + 0.16 * Math.cos(t * 0.55), y: 0.6 + 0.18 * Math.sin(t * 0.30), col: preset.hexColors[2] },
          { x: 0.5 + 0.22 * Math.sin(t * 0.35), y: 0.3 + 0.14 * Math.sin(t * 0.50), col: preset.hexColors[3] },
          { x: 0.2 + 0.14 * Math.cos(t * 0.60), y: 0.7 + 0.20 * Math.sin(t * 0.25), col: preset.hexColors[4] },
        ];

        // Draw radial glowing gradient blobs
        centers.slice(0, blobCount).forEach((blob) => {
          const pixelX = blob.x * canvas.width;
          const pixelY = blob.y * canvas.height;
          // Apply gentle interaction offset
          let offsetXPx = 0;
          let offsetYPx = 0;

          trailsRef.current.forEach((trail) => {
            const dx = blob.x - trail.x;
            const dy = blob.y - trail.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.3) {
              const force = (1.0 - dist / 0.3) * trail.age * warpStrength * 50;
              offsetXPx += (trail.vx * 30 + (dy * -10)) * force;
              offsetYPx += (trail.vy * 30 + (dx * 10)) * force;
            }
          });

          const finalX = pixelX + offsetXPx;
          const finalY = pixelY + offsetYPx;
          const radius = Math.min(canvas.width, canvas.height) * (0.35 + (20.0 - glowRadius) * 0.01);

          const grad = ctx2d!.createRadialGradient(finalX, finalY, 0, finalX, finalY, radius);
          grad.addColorStop(0, blob.col + 'aa'); // Vibrant opaque
          grad.addColorStop(0.3, blob.col + '44'); // Faded translucent
          grad.addColorStop(1, 'rgba(0,0,0,0)'); // Fade to transparent

          ctx2d!.fillStyle = grad;
          ctx2d!.beginPath();
          ctx2d!.arc(finalX, finalY, radius, 0, Math.PI * 2);
          ctx2d!.fill();
        });

        // Add standard film grain - Bypassed on mobile to prevent massive CPU and frame rate lag
        const isMobileDevice = typeof window !== 'undefined' && (window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        if (noiseIntensity > 0 && !isMobileDevice) {
          const imgData = ctx2d.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          const noise = noiseIntensity * 255;
          for (let i = 0; i < data.length; i += 4) {
            const grain = (Math.random() - 0.5) * noise;
            data[i] = Math.max(0, Math.min(255, data[i] + grain));
            data[i+1] = Math.max(0, Math.min(255, data[i+1] + grain));
            data[i+2] = Math.max(0, Math.min(255, data[i+2] + grain));
          }
          ctx2d.putImageData(imgData, 0, 0);
        }
      }

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    // Cleanups
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (gl) {
        if (positionBuffer) gl.deleteBuffer(positionBuffer);
        if (program) gl.deleteProgram(program);
      }
    };
  }, [renderEngine, activePreset, qualityScale, isPaused, autopilot, shouldReduceMotion]);

  return (
    <>
      {/* Absolute fullscreen background */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none select-none overflow-hidden transition-colors duration-1000"
        style={{ zIndex: -20 }}
        id="interactive-bg-wrapper"
      >
        <div
          className="absolute inset-0"
          style={{
            background: shouldReduceMotion ? 'radial-gradient(circle at top, rgba(233,30,99,0.16), transparent 60%)' : undefined,
            backgroundColor: '#000000',
          }}
        />
        {!shouldReduceMotion && (
          <canvas
            ref={canvasRef}
            className="block w-full h-full"
            style={{
              backgroundColor: 'transparent',
              filter: 'contrast(1.05) saturate(1.1)'
            }}
            id="fluid-background-canvas"
          />
        )}
      </div>

      {/* Futuristic Floating Interactive Control Panel */}
      {!shouldReduceMotion && (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans" id="bg-control-container">
        {/* Toggle Widget Button */}
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className={`group flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-neutral-800 bg-black/80 hover:bg-neutral-900/90 text-neutral-300 hover:text-white backdrop-blur-xl shadow-lg hover:shadow-purple-500/15 transition-all duration-300 cursor-pointer text-xs uppercase tracking-widest font-semibold ${isPanelOpen ? 'ring-2 ring-purple-500/50 border-purple-500/30' : ''}`}
          aria-label="Toggle background engine controls"
          id="bg-control-toggle"
        >
          <Sliders className={`h-4 w-4 text-purple-400 group-hover:rotate-12 transition-transform duration-300 ${isPanelOpen ? 'rotate-90' : ''}`} />
          <span>BG Engine</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
        </button>

        {/* Control Panel Sheet (Animate in/out elegantly) */}
        <AnimatePresence>
          {isPanelOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-80 sm:w-88 rounded-2xl border border-neutral-800 bg-neutral-950/90 backdrop-blur-2xl p-5 shadow-2xl text-neutral-300 flex flex-col gap-4 overflow-hidden relative"
              id="bg-control-panel"
            >
              {/* Futuristic Circuit Grid Deco */}
              <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-80" />
              
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-400" />
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-200">
                    Engine Diagnostics
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 bg-neutral-900 px-2 py-0.5 rounded text-[10px] font-mono font-semibold" id="bg-engine-fps">
                  <span className={fps >= 55 ? 'text-emerald-400' : 'text-amber-400'}>
                    {fps} FPS
                  </span>
                </div>
              </div>

              {/* Core Control Sections */}
              <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1">
                {/* Visual Palette Presets */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Aura Coordinates
                  </span>
                  <div className="grid grid-cols-2 gap-2" id="bg-preset-grid">
                    {Object.entries(PRESETS).map(([key, item]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setActivePreset(key);
                          if (key !== 'cyberpunk') setAutopilot(true); // Autopilot showcase for other coordinate mappings
                        }}
                        className={`group relative flex flex-col p-2.5 rounded-xl border bg-neutral-900/50 hover:bg-neutral-900 transition-all text-left cursor-pointer ${activePreset === key ? 'border-purple-500/50 ring-1 ring-purple-500/25 text-white' : 'border-neutral-900 text-neutral-400 hover:text-neutral-200'}`}
                        id={`preset-button-${key}`}
                      >
                        <span className="text-[11px] font-semibold tracking-tight">{item.name}</span>
                        {/* Swatch Previews */}
                        <div className="flex gap-1 mt-1.5">
                          {item.hexColors.slice(1, 4).map((c, i) => (
                            <span key={i} className="w-2.5 h-2.5 rounded-full border border-neutral-950 shadow-inner" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        {activePreset === key && (
                          <Check className="absolute top-2 right-2 h-3.5 w-3.5 text-purple-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Physics & Flow Tuning (Sliders) */}
                <div className="flex flex-col gap-2.5 mt-1 border-t border-neutral-900 pt-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Fluid Dynamics
                  </span>

                  {/* Speed */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Flow Velocity (Drift)</span>
                      <span className="font-mono text-purple-400 text-[10px]">{speed.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="2.5"
                      step="0.1"
                      value={speed}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      className="w-full accent-purple-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                      id="range-speed"
                    />
                  </div>

                  {/* Warp Strength */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Interactive Viscous Warp</span>
                      <span className="font-mono text-purple-400 text-[10px]">{warpStrength.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="3.0"
                      step="0.1"
                      value={warpStrength}
                      onChange={(e) => setWarpStrength(parseFloat(e.target.value))}
                      className="w-full accent-purple-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                      id="range-warp"
                    />
                  </div>

                  {/* Glow Radius */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Nebula Glow Expansion</span>
                      <span className="font-mono text-purple-400 text-[10px]">{(30 - glowRadius).toFixed(0)}u</span>
                    </div>
                    <input
                      type="range"
                      min="4.0"
                      max="24.0"
                      step="0.5"
                      value={glowRadius}
                      // inverted mapping: smaller value means larger circle
                      onChange={(e) => setGlowRadius(parseFloat(e.target.value))}
                      className="w-full accent-purple-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                      id="range-glow"
                    />
                  </div>

                  {/* Viscosity/Dampening */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Vortex Inertia Decay</span>
                      <span className="font-mono text-purple-400 text-[10px]">{(viscosity * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.85"
                      max="0.97"
                      step="0.01"
                      value={viscosity}
                      onChange={(e) => setViscosity(parseFloat(e.target.value))}
                      className="w-full accent-purple-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                      id="range-viscosity"
                    />
                  </div>

                  {/* Blob Count */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Active Core Nuclei</span>
                      <span className="font-mono text-purple-400 text-[10px]">{blobCount} nodes</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={blobCount}
                      onChange={(e) => setBlobCount(parseInt(e.target.value))}
                      className="w-full accent-purple-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                      id="range-blob-count"
                    />
                  </div>

                  {/* Analogue Noise */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Film Grain Density</span>
                      <span className="font-mono text-purple-400 text-[10px]">{(noiseIntensity * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="0.08"
                      step="0.005"
                      value={noiseIntensity}
                      onChange={(e) => setNoiseIntensity(parseFloat(e.target.value))}
                      className="w-full accent-purple-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                      id="range-noise"
                    />
                  </div>
                </div>

                {/* System Settings (Engine Type, Quality Resolution) */}
                <div className="flex flex-col gap-2.5 mt-1 border-t border-neutral-900 pt-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 flex items-center gap-1">
                    <Monitor className="h-3 w-3" /> GPU Architecture
                  </span>

                  {/* Quality Scales */}
                  <div className="flex gap-2" id="bg-quality-selector">
                    {[{ label: 'Low', val: 0.4 }, { label: 'Medium', val: 0.75 }, { label: 'Retina', val: 1.0 }].map((q) => (
                      <button
                        key={q.label}
                        onClick={() => setQualityScale(q.val)}
                        className={`flex-1 py-1 rounded text-[10px] font-semibold border transition-all cursor-pointer ${qualityScale === q.val ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : 'border-neutral-900 bg-neutral-900/30 hover:bg-neutral-900/60 text-neutral-400 hover:text-neutral-300'}`}
                        id={`quality-button-${q.label.toLowerCase()}`}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>

                  {/* Engine Selector */}
                  <div className="flex justify-between items-center text-xs text-neutral-400 mt-1">
                    <span>Render Core</span>
                    <div className="flex bg-neutral-900/50 p-0.5 rounded border border-neutral-900" id="bg-engine-toggle">
                      <button
                        onClick={() => setRenderEngine('webgl')}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${renderEngine === 'webgl' ? 'bg-purple-500 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
                        id="engine-webgl-btn"
                      >
                        WebGL 2
                      </button>
                      <button
                        onClick={() => setRenderEngine('canvas2d')}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${renderEngine === 'canvas2d' ? 'bg-purple-500 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
                        id="engine-canvas-btn"
                      >
                        2D fallback
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel Footer Actions */}
              <div className="flex items-center justify-between border-t border-neutral-900 pt-3 mt-1">
                {/* Autopilot and Play State */}
                <div className="flex gap-1.5" id="bg-action-toggles">
                  {/* Play/Pause */}
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title={isPaused ? 'Resume Motion' : 'Pause Motion'}
                    id="btn-play-pause"
                  >
                    {isPaused ? <CirclePlay className="h-4.5 w-4.5" /> : <CirclePause className="h-4.5 w-4.5" />}
                  </button>

                  {/* Autopilot toggle */}
                  <button
                    onClick={() => setAutopilot(!autopilot)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${autopilot ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : 'bg-neutral-900 text-neutral-400 border border-transparent hover:bg-neutral-800'}`}
                    id="btn-autopilot"
                  >
                    <span className={`w-1 h-1 rounded-full ${autopilot ? 'bg-purple-400 animate-ping' : 'bg-neutral-500'}`} />
                    Autopilot
                  </button>
                </div>

                {/* Reset button */}
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/50 border border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800 text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer"
                  id="btn-reset-diagnostic"
                >
                  <RefreshCw className="h-3 w-3" /> Reset
                </button>
              </div>

              {/* Autopilot Status Note */}
              <div className="text-[9px] text-neutral-600 flex items-center gap-1 mt-0.5">
                <Info className="h-3 w-3 flex-shrink-0" />
                <span>Move your mouse anywhere to interact and override autopilot</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      )}
    </>
  );
}
