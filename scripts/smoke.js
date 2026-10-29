/* smoke.js — the opening-credits drifting smoke, hand-rolled on canvas.
   Cheap: ~30 soft radial sprites, capped DPR, paused when the hero
   scrolls out of view. No images, no video. */

export function initSmoke(canvas) {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return () => {};

  const COUNT = 30;
  let w = 0;
  let h = 0;
  let dpr = 1;
  let particles = [];
  let raf = 0;
  let running = false;

  const rand = (a, b) => a + Math.random() * (b - a);

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(initial) {
    return {
      x: rand(-0.1, 1.1) * w,
      y: initial ? rand(0, 1) * h : rand(0.7, 1.15) * h,
      r: rand(60, 170),
      vx: rand(-0.12, 0.12),
      vy: rand(-0.22, -0.5),
      a: 0,
      amax: rand(0.05, 0.16),
      life: 0,
      ttl: rand(520, 1100),
    };
  }

  function reset() {
    resize();
    particles = Array.from({ length: COUNT }, () => spawn(true));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    for (const p of particles) {
      p.life += 1;
      p.x += p.vx;
      p.y += p.vy;
      // fade in then out over its lifetime
      const t = p.life / p.ttl;
      p.a = Math.sin(Math.min(t, 1) * Math.PI) * p.amax;
      if (p.life >= p.ttl || p.y < -p.r) Object.assign(p, spawn(false));

      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, `rgba(50, 120, 70, ${p.a})`);
      g.addColorStop(0.5, `rgba(20, 50, 30, ${p.a * 0.5})`);
      g.addColorStop(1, "rgba(10, 11, 9, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    raf = requestAnimationFrame(draw);
  }

  function start() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(draw);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  reset();
  const onResize = () => resize();
  window.addEventListener("resize", onResize, { passive: true });

  // pause when hero leaves the viewport
  const io = new IntersectionObserver(
    ([e]) => (e.isIntersecting ? start() : stop()),
    { threshold: 0.02 }
  );
  io.observe(canvas);
  start();

  return () => {
    stop();
    io.disconnect();
    window.removeEventListener("resize", onResize);
  };
}
