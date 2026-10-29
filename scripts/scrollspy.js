/* scrollspy.js — the active rail-nav item brightens as its section
   enters view (Brittany Chiang pattern). IntersectionObserver picks
   the section nearest the top third of the viewport. */

export function initScrollspy() {
  const links = Array.from(document.querySelectorAll(".nav a"));
  if (!links.length) return;

  const map = new Map();
  links.forEach((a) => {
    const id = a.getAttribute("href")?.replace("#", "");
    const sec = id && document.getElementById(id);
    if (sec) map.set(sec, a);
  });

  let current = null;
  const setActive = (a) => {
    if (a === current) return;
    links.forEach((l) => l.classList.remove("is-active"));
    if (a) a.classList.add("is-active");
    current = a;
  };

  const io = new IntersectionObserver(
    (entries) => {
      // among currently-intersecting sections, choose the top-most
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(map.get(visible[0].target));
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
  );

  map.forEach((_, sec) => io.observe(sec));
}
