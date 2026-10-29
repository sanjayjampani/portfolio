/* flip-grid.js — the signature move: morph the projects between a
   stacked list and a 2-up grid using GSAP Flip (records first/last
   layout, tweens the delta). Degrades to an instant toggle if Flip
   or motion is unavailable. */

export function initFlip({ reduce }) {
  const grid = document.getElementById("projects-grid");
  const btn = document.querySelector('[data-toggle="projects"]');
  if (!grid || !btn) return;

  const label = btn.querySelector(".t-label");
  const Flip = window.Flip;
  const gsap = window.gsap;

  const setLabel = (isGrid) => {
    if (label) label.textContent = isGrid ? "view as list" : "view as grid";
    btn.setAttribute("aria-pressed", String(isGrid));
  };

  btn.addEventListener("click", () => {
    const willBeGrid = !grid.classList.contains("as-grid");

    if (reduce || !Flip || !gsap) {
      grid.classList.toggle("as-grid");
      setLabel(willBeGrid);
      return;
    }

    const state = Flip.getState(grid.querySelectorAll(".project"), {
      props: "borderColor,backgroundColor",
    });
    grid.classList.toggle("as-grid");
    setLabel(willBeGrid);
    Flip.from(state, {
      duration: 0.6,
      ease: "power3.inOut",
      absolute: true,
      stagger: 0.04,
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.4 }),
    });
  });
}
