/* loader.js — the first cinematic beat. The name tiles drop in, a
   meter fills, then the black curtain lifts (a camera "kick" into the
   page). Resolves so main.js can run the hero entrance after. */

/* The theme is started from the inline script in index.html, before
   these modules load. When the curtain lifts, stop the loop and let the
   current pass finish. Pausing here cuts the track off on a fast load. */
function releaseTheme() {
  if (window.__releaseTheme) window.__releaseTheme();
}

export function runLoader({ reduce }) {
  const loader = document.getElementById("loader");
  if (!loader) return Promise.resolve();

  const finish = () => {
    releaseTheme();
    if (window.__markLoaderDone) window.__markLoaderDone();
    loader.classList.add("is-done");
    document.body.classList.remove("is-loading");
    setTimeout(() => loader.remove(), 1000);
  };

  const gsap = window.gsap;

  if (reduce || !gsap) {
    finish();
    return Promise.resolve();
  }

  document.body.classList.add("is-loading");

  return new Promise((resolve) => {
    const tiles = loader.querySelectorAll(".tile");
    const bar = loader.querySelector(".loader__bar i");
    const cap = loader.querySelector(".loader__cap");

    const tl = gsap.timeline({
      onComplete: () => {
        finish();
        resolve();
      },
    });

    tl.from(tiles, {
      y: -34,
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: "back.out(1.7)",
      stagger: 0.12,
    })
      .from(cap, { opacity: 0, duration: 0.4 }, "-=0.3")
      .to(bar, { width: "100%", duration: 0.9, ease: "power2.inOut" }, "-=0.4")
      .to({}, { duration: 0.15 });
  });
}
