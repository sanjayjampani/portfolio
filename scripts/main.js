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
import { initFlip } from "./flip-grid.js?v=18";
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

  return lenis;
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

/* Contact is section 05, "Say my name." Play once when that section
   is on screen, after the loader theme. Do not route it through
   AudioContext: a scroll is not a tap, so a new context stays
   suspended and the clip is silent until a click. */
function initSayMyName() {
  const section = document.getElementById("contact");
  if (!section) return;
  const audio = new Audio("assets/say-my-name.wav");
  audio.preload = "auto";
  audio.loop = false;
  audio.volume = 1;
  let used = false;
  let want = false;

  const onScreen = () => {
    const r = section.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  };

  const themeQuiet = () => {
    const t = document.getElementById("bb-theme");
    return !t || t.paused || t.ended;
  };

  const playNow = () => {
    if (used || !want || !themeQuiet()) return;
    audio.loop = false;
    audio.currentTime = 0;
    audio.play().then(() => {
      used = true;
    }).catch(() => {});
  };

  const requestPlay = () => {
    if (used) return;
    want = true;
    window.__hasWaitingAudio = true;
    if (window.__afterLoaderAudio) window.__afterLoaderAudio(playNow);
    else playNow();
  };

  window.addEventListener(
    "pointerdown",
    () => {
      if (!want && !onScreen()) return;
      want = true;
      playNow();
    },
    true
  );

  document.getElementById("bb-theme")?.addEventListener("ended", playNow);

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) requestPlay();
      }
    },
    { threshold: 0.2 }
  );
  io.observe(section);

  document.querySelectorAll('a[href="#contact"]').forEach((link) => {
    link.addEventListener("click", requestPlay);
  });
}

/* ---- boot ---- */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

initSayMyName();
const lenis = initScroll();
if (!reduce) {
  const canvas = document.getElementById("smoke");
  if (canvas) initSmoke(canvas);
  initSpotlight();
}

runLoader({ reduce }).then(() => {
  window.scrollTo(0, 0);
  if (lenis) lenis.scrollTo(0, { immediate: true });
  heroIntro();
  if (!reduce && ScrollTrigger) ScrollTrigger.refresh();
});
