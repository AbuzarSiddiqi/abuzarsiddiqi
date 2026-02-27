const root = document.documentElement;
const header = document.querySelector(".site-header");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = Array.from(document.querySelectorAll(".main-nav a"));
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const caseStudyToggle = document.getElementById("caseStudyToggle");
const caseStudy = document.getElementById("caseStudy");
const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
const filterItems = Array.from(document.querySelectorAll(".filter-item"));
const previewPanel = document.getElementById("previewPanel");
const previewTitle = document.getElementById("previewTitle");
const previewText = document.getElementById("previewText");
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const revealElements = Array.from(document.querySelectorAll(".reveal"));

const PROFILE = {
  email: "abuzarxsiddiqi@gmail.com"
};

root.classList.add("js");

const theme = safeStorageGet("theme", "light");
setTheme(theme);

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

menuToggle?.addEventListener("click", () => {
  if (!mainNav) return;
  const willOpen = !mainNav.classList.contains("open");
  mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(willOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mainNav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  safeStorageSet("theme", nextTheme);
});

caseStudyToggle?.addEventListener("click", () => {
  if (!caseStudy) return;
  const expanded = caseStudy.classList.toggle("open");
  caseStudyToggle.setAttribute("aria-expanded", String(expanded));
  caseStudyToggle.textContent = expanded ? "Hide Case Study" : "View Case Study";
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "all";
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    filterItems.forEach((item) => {
      const tags = (item.dataset.tags || "").split(" ").filter(Boolean);
      const matches = filter === "all" || tags.includes(filter);
      item.classList.toggle("hidden", !matches);
    });
  });
});

document.querySelectorAll(".app-icon-card").forEach((card) => {
  const syncPreview = () => {
    const title = card.querySelector("h4")?.textContent || "Project";
    const preview = card.dataset.preview || "Project preview";
    if (!previewPanel || !previewTitle || !previewText) return;
    previewTitle.textContent = title;
    previewText.textContent = preview;
  };

  card.addEventListener("mouseenter", syncPreview);
  card.addEventListener("focus", syncPreview);
});

window.addEventListener(
  "scroll",
  () => {
    header?.classList.toggle("scrolled", window.scrollY > 8);
  },
  { passive: true }
);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          if (!href) return;
          const target = href.replace("#", "");
          link.classList.toggle("active", target === id);
        });
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("visible"));
}

document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.dataset.copy || "";
    if (!text) return;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        blinkButton(button, "Copied");
        return;
      } catch {
        // fallback path below
      }
    }

    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "true");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    try {
      document.execCommand("copy");
      blinkButton(button, "Copied");
    } catch {
      blinkButton(button, "Failed");
    } finally {
      helper.remove();
    }
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  if (!name || !email || !message) {
    if (formNote) formNote.textContent = "Please fill in all fields.";
    return;
  }

  const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;

  if (formNote) formNote.textContent = "Your mail app is opening. If it doesn't, email directly.";
  contactForm.reset();
});

function blinkButton(button, label) {
  const previous = button.textContent;
  button.textContent = label;
  setTimeout(() => {
    button.textContent = previous;
  }, 1200);
}

function setTheme(mode) {
  const normalized = mode === "dark" ? "dark" : "light";
  root.setAttribute("data-theme", normalized);
  if (themeIcon) {
    themeIcon.textContent = normalized === "dark" ? "☀" : "◐";
  }
}

function safeStorageGet(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore storage restrictions
  }
}
