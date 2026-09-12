import React, { useEffect, useRef, useState } from 'react';

interface CyberBackgroundProps {
  enabled?: boolean;
}

export const CyberBackground: React.FC<CyberBackgroundProps> = ({ enabled = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!enabled || isPaused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle and node grid setup
    const particlesCount = Math.min(45, Math.floor(width / 35));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    const colors = ['rgba(6, 182, 212, ', 'rgba(59, 130, 246, ', 'rgba(16, 185, 129, '];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // 3D wireframe shield rotation angle
    let shieldAngle = 0;
    let scanLineY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle perspective scanning grid at the bottom
      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.035)';
      ctx.lineWidth = 1;
      const gridY = height * 0.7;
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(width / 2 + (x - width / 2) * 0.4, gridY);
        ctx.stroke();
      }
      for (let y = gridY; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw moving horizontal security scanning beam
      scanLineY += 0.8;
      if (scanLineY > height) scanLineY = 0;
      const grad = ctx.createLinearGradient(0, scanLineY - 30, 0, scanLineY + 30);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.04)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanLineY - 30, width, 60);

      // 3. Draw 3D wireframe geometric shield in background center
      shieldAngle += 0.005;
      ctx.save();
      const cx = width * 0.78;
      const cy = Math.min(height * 0.35, 340);
      const shieldScale = Math.min(width * 0.18, 140);

      ctx.translate(cx, cy);

      // Shield points in normalized 3D coords [x, y, z]
      const basePoints = [
        [0, -1.2, 0],       // top center
        [0.9, -0.9, 0.2],   // top right
        [0.85, 0.1, 0.3],   // mid right
        [0, 1.2, 0.4],      // bottom tip
        [-0.85, 0.1, 0.3],  // mid left
        [-0.9, -0.9, 0.2],  // top left
        [0, 0, 0.6],        // center boss (bulge)
      ];

      // Rotate around Y axis
      const cosA = Math.cos(shieldAngle);
      const sinA = Math.sin(shieldAngle);

      const projected = basePoints.map(([px, py, pz]) => {
        const rx = px * cosA - pz * sinA;
        const rz = px * sinA + pz * cosA + 2.5; // distance offset
        const fov = 280 / rz;
        return {
          x: rx * fov * (shieldScale * 0.008),
          y: py * fov * (shieldScale * 0.008),
          alpha: Math.max(0.08, Math.min(0.25, 0.18 + (rz - 2.5) * 0.1)),
        };
      });

      // Draw outer contour
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.18)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(projected[0].x, projected[0].y);
      for (let i = 1; i <= 5; i++) {
        ctx.lineTo(projected[i].x, projected[i].y);
      }
      ctx.closePath();
      ctx.stroke();

      // Connect perimeter to center boss
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.12)';
      const centerP = projected[6];
      for (let i = 0; i <= 5; i++) {
        ctx.beginPath();
        ctx.moveTo(centerP.x, centerP.y);
        ctx.lineTo(projected[i].x, projected[i].y);
        ctx.stroke();
      }

      // Draw node points
      for (const p of projected) {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 4. Update and draw floating network particles & connection lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `${p.color}${p.alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.08;
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, isPaused]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full block opacity-85" />
      {/* Subtle radial vignette gradient to keep main content perfectly readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07090e]/75 via-[#07090e]/85 to-[#07090e] pointer-events-none" />
    </div>
  );
};
