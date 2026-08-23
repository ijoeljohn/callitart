const ANSWERS = {
  mirror:
    "You suspect art shows us to ourselves — sometimes flatteringly, often not. Every generation gets the mirror it deserves, and every mirror eventually becomes a portrait of its era.",
  question:
    "For you, art is inquiry. The best works do not answer; they ask better and better questions, until the asking itself starts to feel like meaning.",
  rebellion:
    "You see art as refusal — of ugliness, of silence, of the way things are. Every blank canvas is a small act of defiance against a world that did not ask for it.",
  refuge:
    "You go to art the way others go to church or to the sea: to be restored. Beauty, for you, is not a luxury but a shelter — and shelters are serious things.",
  game: "You like your art playful — rules invented, then broken with a wink. Seriousness, you suspect, is often just play that forgot to smile.",
  prayer:
    "For you, art reaches for what cannot be said. It does not need to be answered; it only needs to be offered.",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

const toggle = document.querySelector(".nav-toggle");
const mobileNav = document.querySelector("#mobile-nav");

function setNav(open) {
  document.body.classList.toggle("nav-open", open);
  if (!mobileNav || !toggle) return;
  mobileNav.hidden = !open;
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

if (toggle && mobileNav) {
  toggle.addEventListener("click", () => setNav(mobileNav.hidden));
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNav(false));
  });
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 1024px)").matches) setNav(false);
  });
}

const blank = document.querySelector("#answer-blank");
const answerText = document.querySelector("#answer-text");
const optionButtons = document.querySelectorAll(".options button");

optionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.key;
    const label = button.dataset.label;
    if (!key || !ANSWERS[key]) return;

    optionButtons.forEach((btn) => btn.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");

    if (blank) {
      blank.textContent = `${label}.`;
      blank.classList.add("is-set");
    }

    if (!answerText) return;
    const next = ANSWERS[key];
    if (reduceMotion) {
      answerText.textContent = next;
      return;
    }
    answerText.classList.add("is-fading");
    window.setTimeout(() => {
      answerText.textContent = next;
      answerText.classList.remove("is-fading");
    }, 180);
  });
});

/* Soft image fallback if a remote asset fails */
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => {
    img.style.background =
      "linear-gradient(135deg, hsl(36 22% 91%), hsl(12 40% 85%))";
    img.alt = img.alt || "Artwork study unavailable";
    img.removeAttribute("src");
  });
});
