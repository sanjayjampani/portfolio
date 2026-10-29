/* elementize.js — longest-match-first periodic scanner.
   Walks the leftover letters of each name word (everything after the
   leading hero tile) and wraps any hidden chemical symbol in a
   <span class="sub">. The egg toggle then flares them green.
   Two-letter symbols win over one-letter (so "lu" beats "l"+"u"). */

import { BY_LOWER } from "./elements.js";

function wrap(text) {
  let out = "";
  let i = 0;
  const lower = text.toLowerCase();
  while (i < text.length) {
    const two = lower.slice(i, i + 2);
    const one = lower.slice(i, i + 1);
    let hit = null;
    if (two.length === 2 && BY_LOWER[two]) hit = { len: 2, el: BY_LOWER[two] };
    else if (BY_LOWER[one]) hit = { len: 1, el: BY_LOWER[one] };

    if (hit) {
      const seg = text.slice(i, i + hit.len);
      out += `<span class="sub" title="${hit.el.name} · ${hit.el.num}">${seg}</span>`;
      i += hit.len;
    } else {
      out += text[i];
      i += 1;
    }
  }
  return out;
}

export function setupElementize() {
  const rests = document.querySelectorAll(".wordmark .wm-name");
  rests.forEach((node) => {
    const raw = node.getAttribute("data-rest") ?? node.textContent;
    node.innerHTML = wrap(raw);
  });

  const egg = document.querySelector(".egg");
  if (!egg) return;
  egg.addEventListener("click", () => {
    const on = document.body.classList.toggle("egg-on");
    egg.setAttribute("aria-pressed", String(on));
    const label = egg.querySelector(".egg-label");
    if (label) label.textContent = on ? "hidden elements: on" : "reveal hidden elements";
  });
}
