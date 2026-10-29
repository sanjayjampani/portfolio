/* countup.js — numbers tick up to their target when scrolled into view.
   Reads data-count / data-prefix / data-suffix / data-decimals so the
   markup stays the single source of truth. Tabular-nums prevents jitter. */

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function animate(el) {
  const target = parseFloat(el.dataset.count);
  if (Number.isNaN(target)) return;
  const dec = Number(el.dataset.decimals || 0);
  const pre = el.dataset.prefix || "";
  const suf = el.dataset.suffix || "";
  const dur = 1200;
  let start = null;

  const step = (ts) => {
    if (start === null) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const val = target * easeOutExpo(p);
    el.textContent = pre + val.toFixed(dec) + suf;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = pre + target.toFixed(dec) + suf;
  };
  requestAnimationFrame(step);
}

export function initCountUp() {
  const nums = document.querySelectorAll("[data-count]");
  if (!nums.length) return;
  if (!("IntersectionObserver" in window)) {
    nums.forEach(animate);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        animate(e.target);
        io.unobserve(e.target);
      });
    },
    { threshold: 0.6 }
  );
  nums.forEach((n) => io.observe(n));
}
