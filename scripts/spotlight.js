/* spotlight.js — a soft green radial glow tracks the cursor across the
   dark ground (Brittany Chiang steal). Position is written to CSS vars
   and eased with rAF so it never jitters. Pointer devices only. */

export function initSpotlight() {
  if (window.matchMedia("(hover: none)").matches) return;

  const tx = { x: window.innerWidth / 2, y: -200 };
  const cur = { x: tx.x, y: tx.y };
  let raf = 0;
  let active = false;

  const onMove = (e) => {
    tx.x = e.clientX;
    tx.y = e.clientY;
    if (!active) {
      active = true;
      document.body.classList.add("has-spotlight");
    }
  };

  const tick = () => {
    cur.x += (tx.x - cur.x) * 0.12;
    cur.y += (tx.y - cur.y) * 0.12;
    document.body.style.setProperty("--mx", `${cur.x}px`);
    document.body.style.setProperty("--my", `${cur.y}px`);
    raf = requestAnimationFrame(tick);
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("blur", () => document.body.classList.remove("has-spotlight"));
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
  };
}
