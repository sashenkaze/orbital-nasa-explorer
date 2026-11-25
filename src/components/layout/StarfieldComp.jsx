import { useEffect, useRef } from 'react';

function random(min, max) {
  return min + Math.random() * (max - min);
}

export default function StarfieldComp({ density = 1, shootingStars = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastShot = 0;
    let stars = [];
    let shots = [];
    let running = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.max(55, Math.min(210, Math.round((width * height / 8200) * density)));
      stars = Array.from({ length: count }, () => ({
        x: random(0, width),
        y: random(0, height),
        radius: random(0.35, 1.35),
        alpha: random(0.16, 0.78),
        phase: random(0, Math.PI * 2),
        speed: random(0.35, 1.1),
        tint: Math.random() > 0.86 ? 'warm' : 'cool',
      }));
      draw(0, true);
    };

    const draw = (time, staticFrame = false) => {
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        const flicker = staticFrame || reducedMotion ? 0 : Math.sin(time * 0.0008 * star.speed + star.phase) * 0.16;
        const alpha = Math.max(0.08, Math.min(0.9, star.alpha + flicker));
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = star.tint === 'warm'
          ? `rgba(231, 197, 168, ${alpha})`
          : `rgba(210, 225, 239, ${alpha})`;
        context.fill();
        if (star.radius > 1.05) {
          context.fillStyle = `rgba(208, 225, 240, ${alpha * 0.08})`;
          context.beginPath();
          context.arc(star.x, star.y, star.radius * 3.2, 0, Math.PI * 2);
          context.fill();
        }
      }

      shots = shots.filter((shot) => shot.progress < 1);
      for (const shot of shots) {
        const travel = shot.progress * shot.distance;
        const x = shot.x + Math.cos(shot.angle) * travel;
        const y = shot.y + Math.sin(shot.angle) * travel;
        const tail = 95 * (1 - shot.progress * 0.45);
        const gradient = context.createLinearGradient(
          x - Math.cos(shot.angle) * tail,
          y - Math.sin(shot.angle) * tail,
          x,
          y,
        );
        gradient.addColorStop(0, 'rgba(198, 220, 240, 0)');
        gradient.addColorStop(1, `rgba(223, 232, 241, ${0.55 * (1 - shot.progress)})`);
        context.strokeStyle = gradient;
        context.lineWidth = 1.1;
        context.beginPath();
        context.moveTo(x - Math.cos(shot.angle) * tail, y - Math.sin(shot.angle) * tail);
        context.lineTo(x, y);
        context.stroke();
        shot.progress += shot.step;
      }
    };

    const animate = (time) => {
      if (!running) return;
      if (shootingStars && !reducedMotion && time - lastShot > random(9500, 17000)) {
        shots.push({
          x: random(width * 0.2, width * 0.95),
          y: random(height * 0.02, height * 0.52),
          angle: random(0.62, 1.05),
          distance: random(130, 240),
          progress: 0,
          step: random(0.009, 0.016),
        });
        lastShot = time;
      }
      draw(time);
      frame = window.requestAnimationFrame(animate);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running && !reducedMotion) frame = window.requestAnimationFrame(animate);
      else window.cancelAnimationFrame(frame);
    };

    resize();
    if (!reducedMotion) frame = window.requestAnimationFrame(animate);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density, shootingStars]);

  return <canvas className="starfield-canvas" ref={canvasRef} aria-hidden="true" />;
}
