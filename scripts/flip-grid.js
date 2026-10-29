/* flip-grid.js — the signature move: morph the projects between a
   stacked list and a 2-up grid using GSAP Flip (records first/last
   layout, tweens the delta). Degrades to an instant toggle if Flip
   or motion is unavailable. */

export function initFlip() {
  const grid = document.getElementById("projects-grid");
  const btn = document.querySelector('[data-toggle="projects"]');
  if (!grid || !btn) return;

  const label = btn.querySelector(".t-label");

  const setLabel = (isGrid) => {
    if (label) label.textContent = isGrid ? "view as list" : "view as grid";
    btn.setAttribute("aria-pressed", String(isGrid));
  };

  btn.addEventListener("click", () => {
    const willBeGrid = !grid.classList.contains("as-grid");
    grid.classList.toggle("as-grid");
    setLabel(willBeGrid);
    window.dispatchEvent(new Event("resize"));
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  });
}
