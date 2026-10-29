/* main.js — orchestrator.
   Content is fully usable with no JS; everything here is enhancement.
   One update loop: Lenis drives gsap.ticker, which drives ScrollTrigger.
   Heavy motion (smoke, spotlight, scrubbed parallax) is skipped under
   prefers-reduced-motion. */

import { setupElementize } from "./elementize.js";
import { initReveals } from "./reveals.js";
import { initScrollspy } from "./scrollspy.js";
import { initSpotlight } from "./spotlight.js";
import { initCountUp } from "./countup.js";
import { initFlip } from "./flip-grid.js";
import { initSmoke } from "./smoke.js";
import { runLoader } from "./loader.js";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const Lenis = window.Lenis;

document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

/* ---- content-independent enhancements (safe always) ---- */
setupElementize();
initReveals();
initScrollspy();
initCountUp();
initFlip({ reduce });

/* ---- smooth scroll + scrubbed motion (skip on reduced motion) ---- */
function initScroll() {
  if (reduce || !gsap || !Lenis) return;
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 1,
    smoothWheel: true,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // hero parallax — smoke drifts slower than the wordmark as you dolly down
  const hero = document.querySelector(".hero");
  if (hero) {
    gsap.to(".smoke", {
      yPercent: 22,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".wordmark", {
      yPercent: 10,
      opacity: 0.55,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    });
  }

  // anchor clicks route through Lenis for a smooth dolly
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -10, duration: 1.1 });
    });
  });
}

/* ---- hero entrance (runs after the loader curtain lifts) ---- */
function heroIntro() {
  if (reduce || !gsap) return;
  const targets = document.querySelectorAll("[data-hero]");
  if (!targets.length) return;
  gsap.from(targets, {
    y: 26,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.08,
    clearProps: "transform,opacity",
  });
}

/* ---- boot ---- */
initScroll();
if (!reduce) {
  const canvas = document.getElementById("smoke");
  if (canvas) initSmoke(canvas);
  initSpotlight();
}

runLoader({ reduce }).then(() => {
  heroIntro();
  if (!reduce && ScrollTrigger) ScrollTrigger.refresh();
});
