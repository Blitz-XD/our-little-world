
import { useEffect, useRef } from "react";

export default function PetalCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let width = 0;
    let height = 0;
    let animationId;
    let petals = [];
    let mouseX = 0;
    let targetX = 0;
    let lastTime = 0;

    const colors = [
      "rgba(190, 204, 246, 0.65)",
      "rgba(205, 190, 235, 0.67)",
      "rgba(239, 235, 255, 0.8)",
      "rgba(220, 231, 247, 0.7)",
      "rgba(244, 224, 239, 0.58)",
    ];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const widthChanged = window.innerWidth !== width;

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!petals.length || widthChanged) {
        const count = Math.min(
          65,
          Math.max(24, Math.floor((width * height) / 22000))
        );

        petals = Array.from({ length: count }, () => makePetal(true));
      }
    }

    function makePetal(randomY = false) {
      const size = 7 + Math.random() * 13;

      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : -size * 2,
        size,
        speed: 0.22 + Math.random() * 0.65,
        sway: 12 + Math.random() * 35,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.012,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.55 + Math.random() * 0.4,
      };
    }

    function drawPetal(p) {
      ctx.save();
      ctx.translate(
        p.x + Math.sin(p.angle) * p.sway + mouseX * 65,
        p.y
      );
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -p.size * 0.5, -p.size * 0.5,
        -p.size * 0.85, p.size * 0.7,
        0, p.size * 1.3
      );
      ctx.bezierCurveTo(
        p.size * 0.85, p.size * 0.7,
        p.size * 0.5, -p.size * 0.5,
        0, 0
      );
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.lineTo(0, p.size * 0.95);
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.lineWidth = 0.65;
      ctx.stroke();

      ctx.restore();
    }

    function draw(time = 0) {
      animationId = requestAnimationFrame(draw);

      const delta = Math.min((time - (lastTime || time)) / 16.67, 2);
      lastTime = time;
      mouseX += (targetX - mouseX) * Math.min(0.06 * delta, 1);

      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        drawPetal(p);

        if (!reduceMotion.matches) {
          p.y += p.speed * delta;
          p.angle += 0.008 * delta;
          p.rotation += p.spin * delta;

          if (p.y > height + p.size * 2) {
            Object.assign(p, makePetal(false));
          }
        }
      });
    }

    function handleMouseMove(event) {
          targetX = (event.clientX - width / 2) / Math.max(width, 1);
    }

    function handleMotionChange() {
      lastTime = 0;
    }

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    reduceMotion.addEventListener("change", handleMotionChange);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      reduceMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="petal-canvas" aria-hidden="true" />;
}
