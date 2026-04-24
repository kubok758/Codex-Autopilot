const header = document.querySelector("[data-elevate]");
const revealItems = document.querySelectorAll(".reveal");
const modeButtons = document.querySelectorAll("[data-mode]");
const speedToggle = document.querySelector("[data-speed-toggle]");
const speedLabel = document.querySelector("[data-speed-label]");
const modeCopy = document.querySelector("[data-mode-copy]");
const meter = document.querySelector("[data-meter]");
const copyButton = document.querySelector("[data-copy-path]");
const copyValue = document.querySelector("[data-copy-value]");
const faqButtons = document.querySelectorAll(".faq-item");

const modeText = {
  normal: {
    adaptive: "Спокойнее тормозит, держит полосу и следует дорожным лимитам.",
    fixed: "Едет мягко, но не выходит за выбранный лимит скорости маршрута.",
    meter: "48%",
  },
  aggressive: {
    adaptive: "Раньше ускоряется, смелее обгоняет и держится ближе к пределам AI.",
    fixed: "Максимально использует заданный лимит и агрессивный профиль BeamNG AI.",
    meter: "86%",
  },
};

let currentMode = "normal";

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-elevated", window.scrollY > 10);
}

function updateDemo() {
  const fixed = speedToggle && speedToggle.checked;
  if (speedLabel) speedLabel.textContent = fixed ? "Fixed limit" : "Adaptive";
  if (modeCopy) modeCopy.textContent = modeText[currentMode][fixed ? "fixed" : "adaptive"];
  if (meter) meter.style.width = fixed ? (currentMode === "aggressive" ? "96%" : "62%") : modeText[currentMode].meter;
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentMode = button.dataset.mode || "normal";
    modeButtons.forEach((item) => item.classList.toggle("active", item === button));
    updateDemo();
  });
});

if (speedToggle) {
  speedToggle.addEventListener("change", updateDemo);
}

if (copyButton && copyValue) {
  copyButton.addEventListener("click", async () => {
    const value = copyValue.textContent.trim();
    try {
      await navigator.clipboard.writeText(value);
      copyButton.textContent = "Скопировано";
      setTimeout(() => {
        copyButton.textContent = "Скопировать путь";
      }, 1600);
    } catch {
      copyButton.textContent = value;
    }
  });
}

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isOpen = button.classList.contains("open");
    faqButtons.forEach((item) => item.classList.remove("open"));
    if (!isOpen) button.classList.add("open");
  });
});

updateDemo();
