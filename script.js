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
const appCards = Array.from(document.querySelectorAll(".app-icon-card"));
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const revealElements = Array.from(document.querySelectorAll(".reveal"));
const iphoneOverlay = document.getElementById("iphoneOverlay");
const iphoneWindow = document.getElementById("iphoneWindow");
const iphoneDragHandle = document.getElementById("iphoneDragHandle");
const iphoneTitle = document.getElementById("iphoneTitle");
const iphoneOpenLink = document.getElementById("iphoneOpenLink");
const iphoneCloseBtn = document.getElementById("iphoneCloseBtn");
const iphoneAppFrame = document.getElementById("iphoneAppFrame");

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

appCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const href = card.getAttribute("href");
    if (!href) return;
    event.preventDefault();
    openIphonePreview(href, card.querySelector("h4")?.textContent || "KwikVerse App");
  });
});

iphoneCloseBtn?.addEventListener("click", closeIphonePreview);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeIphonePreview();
  }
});

iphoneDragHandle?.addEventListener("pointerdown", startIphoneDrag);
window.addEventListener("pointermove", onIphoneDragMove);
window.addEventListener("pointerup", stopIphoneDrag);
window.addEventListener("pointercancel", stopIphoneDrag);

window.addEventListener("resize", () => {
  keepIphoneInViewport();
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

let phoneDrag = null;

function openIphonePreview(url, title) {
  if (!iphoneOverlay || !iphoneWindow || !iphoneAppFrame || !iphoneOpenLink || !iphoneTitle) return;

  iphoneTitle.textContent = title || "KwikVerse App";
  iphoneOpenLink.href = url;
  iphoneAppFrame.src = url;

  iphoneOverlay.hidden = false;
  iphoneOverlay.setAttribute("aria-hidden", "false");

  if (!iphoneWindow.dataset.positioned) {
    positionIphoneDefault();
  } else {
    keepIphoneInViewport();
  }
}

function closeIphonePreview() {
  if (!iphoneOverlay || !iphoneAppFrame) return;
  iphoneOverlay.hidden = true;
  iphoneOverlay.setAttribute("aria-hidden", "true");
  iphoneAppFrame.src = "about:blank";
}

function startIphoneDrag(event) {
  if (!iphoneWindow || event.button !== 0) return;
  if (event.target instanceof Element && event.target.closest(".iphone-actions")) return;

  const rect = iphoneWindow.getBoundingClientRect();
  phoneDrag = {
    pointerId: event.pointerId,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top
  };

  iphoneWindow.classList.add("dragging");
  iphoneWindow.dataset.positioned = "true";
  iphoneDragHandle?.setPointerCapture(event.pointerId);
}

function onIphoneDragMove(event) {
  if (!phoneDrag || !iphoneWindow || phoneDrag.pointerId !== event.pointerId) return;

  const rect = iphoneWindow.getBoundingClientRect();
  const bounds = getPhoneBounds(rect.width, rect.height);
  const nextLeft = clamp(event.clientX - phoneDrag.offsetX, bounds.minLeft, bounds.maxLeft);
  const nextTop = clamp(event.clientY - phoneDrag.offsetY, bounds.minTop, bounds.maxTop);

  setIphonePosition(nextLeft, nextTop);
}

function stopIphoneDrag(event) {
  if (!phoneDrag || phoneDrag.pointerId !== event.pointerId) return;
  iphoneWindow?.classList.remove("dragging");
  if (iphoneDragHandle?.hasPointerCapture(event.pointerId)) {
    iphoneDragHandle.releasePointerCapture(event.pointerId);
  }
  phoneDrag = null;
}

function positionIphoneDefault() {
  if (!iphoneWindow) return;
  const rect = iphoneWindow.getBoundingClientRect();
  const bounds = getPhoneBounds(rect.width, rect.height);
  const top = clamp(84, bounds.minTop, bounds.maxTop);
  setIphonePosition(bounds.maxLeft, top);
  iphoneWindow.dataset.positioned = "true";
}

function keepIphoneInViewport() {
  if (!iphoneWindow || iphoneOverlay?.hidden) return;
  const rect = iphoneWindow.getBoundingClientRect();
  const bounds = getPhoneBounds(rect.width, rect.height);
  const left = clamp(rect.left, bounds.minLeft, bounds.maxLeft);
  const top = clamp(rect.top, bounds.minTop, bounds.maxTop);
  setIphonePosition(left, top);
}

function getPhoneBounds(width, height) {
  const pad = 8;
  return {
    minLeft: pad,
    maxLeft: Math.max(pad, window.innerWidth - width - pad),
    minTop: pad,
    maxTop: Math.max(pad, window.innerHeight - height - pad)
  };
}

function setIphonePosition(left, top) {
  if (!iphoneWindow) return;
  iphoneWindow.style.left = `${left}px`;
  iphoneWindow.style.top = `${top}px`;
  iphoneWindow.style.right = "auto";
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/* ============ Hero Portrait – Slash Reveal ============ */
(function initPortraitEffect() {
  var portrait = document.getElementById("heroPortrait");
  var inner = document.getElementById("portraitInner");
  var hoodieImg = document.getElementById("portraitReveal");
  var maskCanvas = document.getElementById("portraitMask");
  var shine = document.getElementById("portraitShine");

  if (!portrait || !inner || !hoodieImg || !maskCanvas) return;

  var ctx = maskCanvas.getContext("2d");
  var W = 0, H = 0, dpr = 1;
  var rafId = null;
  var current = { x: 0.5, y: 0.5 };
  var target = { x: 0.5, y: 0.5 };
  var isHovering = false;
  var hoodieReady = false;
  var hoodieImage = new Image();
  var lastPaint = { x: -999, y: -999 };
  var fadeRaf = null;
  var canvasOpacity = 0;

  var TILT_MAX = 12;
  var LERP = 0.08;
  var BRUSH_ANGLE = -30 * (Math.PI / 180);
  var BRUSH_LEN = 140;
  var BRUSH_W = 22;
  var MIN_DIST = 3;
  var BRISTLE_COUNT = 7;
  var seed = 1;

  // Load hoodie image for canvas painting
  hoodieImage.src = hoodieImg.src;
  hoodieImage.onload = function () {
    hoodieReady = true;
    sizeCanvas();
  };

  function sizeCanvas() {
    var rect = inner.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    W = Math.round(rect.width);
    H = Math.round(rect.height);
    maskCanvas.width = W * dpr;
    maskCanvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", sizeCanvas);
  sizeCanvas();

  portrait.addEventListener("mouseenter", function () {
    isHovering = true;
    lastPaint = { x: -999, y: -999 };
    // Stop any fade-out
    if (fadeRaf) { cancelAnimationFrame(fadeRaf); fadeRaf = null; }
    maskCanvas.style.opacity = "1";
    canvasOpacity = 1;
    if (!rafId) rafId = requestAnimationFrame(animate);
  });

  portrait.addEventListener("mousemove", function (e) {
    var rect = inner.getBoundingClientRect();
    var px = e.clientX - rect.left;
    var py = e.clientY - rect.top;
    target.x = px / rect.width;
    target.y = py / rect.height;

    if (hoodieReady) {
      var dx = px - lastPaint.x;
      var dy = py - lastPaint.y;
      if (Math.sqrt(dx * dx + dy * dy) >= MIN_DIST) {
        paintBrushStroke(px, py);
        lastPaint.x = px;
        lastPaint.y = py;
      }
    }
  });

  portrait.addEventListener("mouseleave", function () {
    isHovering = false;
    target.x = 0.5;
    target.y = 0.5;
    lastPaint = { x: -999, y: -999 };
    fadeOutCanvas();
  });

  function quickRand() {
    seed = (seed * 16807 + 11) % 2147483647;
    return (seed & 0x7fffffff) / 2147483647;
  }

  // Replicate CSS object-fit:cover + object-position:top center on canvas
  function drawHoodieCover() {
    var iw = hoodieImage.naturalWidth;
    var ih = hoodieImage.naturalHeight;
    if (!iw || !ih) return;
    var scale = Math.max(W / iw, H / ih);
    var dw = iw * scale;
    var dh = ih * scale;
    var dx = (W - dw) / 2; // center horizontally
    var dy = 0;             // top-aligned vertically
    ctx.drawImage(hoodieImage, dx, dy, dw, dh);
  }

  function paintBrushStroke(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(BRUSH_ANGLE);

    // Build an organic brush path using overlapping ellipses along the stroke
    ctx.beginPath();
    var steps = 18;
    var halfL = BRUSH_LEN / 2;

    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var sx = -halfL + t * BRUSH_LEN;
      // Vary the width along the stroke — thinner at edges, thicker in middle
      var widthHere = BRUSH_W * (0.45 + 0.55 * Math.sin(t * Math.PI));
      // Add organic wobble
      var wobbleY = (quickRand() - 0.5) * BRUSH_W * 0.5;
      var wobbleR = (quickRand() - 0.3) * 4;

      ctx.ellipse(
        sx, wobbleY,
        widthHere * 0.5 + wobbleR,
        widthHere * 0.38 + wobbleR * 0.6,
        quickRand() * 0.4 - 0.2,
        0, Math.PI * 2
      );
    }

    // Add scattered bristle marks for texture
    for (var b = 0; b < BRISTLE_COUNT; b++) {
      var bx = (quickRand() - 0.5) * BRUSH_LEN * 0.9;
      var by = (quickRand() - 0.5) * BRUSH_W * 1.2;
      var br = quickRand() * 5 + 2;
      ctx.moveTo(bx + br, by);
      ctx.arc(bx, by, br, 0, Math.PI * 2);
    }

    ctx.clip();

    // Draw hoodie image aligned to the container (matching blazer's cover fit)
    ctx.rotate(-BRUSH_ANGLE);
    ctx.translate(-x, -y);
    drawHoodieCover();

    ctx.restore();
  }

  function fadeOutCanvas() {
    if (fadeRaf) cancelAnimationFrame(fadeRaf);

    function step() {
      canvasOpacity -= 0.025;
      if (canvasOpacity <= 0) {
        canvasOpacity = 0;
        maskCanvas.style.opacity = "0";
        ctx.clearRect(0, 0, W, H);
        fadeRaf = null;
        return;
      }
      maskCanvas.style.opacity = canvasOpacity.toFixed(3);
      fadeRaf = requestAnimationFrame(step);
    }
    fadeRaf = requestAnimationFrame(step);
  }

  function animate() {
    current.x += (target.x - current.x) * LERP;
    current.y += (target.y - current.y) * LERP;

    var tiltX = (current.y - 0.5) * -TILT_MAX;
    var tiltY = (current.x - 0.5) * TILT_MAX;
    var s = isHovering ? 1.03 : 1;

    inner.style.transform =
      "rotateX(" + tiltX.toFixed(2) + "deg) " +
      "rotateY(" + tiltY.toFixed(2) + "deg) " +
      "scale3d(" + s + "," + s + "," + s + ")";

    // Dynamic shadow that shifts opposite to tilt for 3D depth
    if (isHovering) {
      var shadowX = (0.5 - current.x) * 40;
      var shadowY = (0.5 - current.y) * 40;
      inner.style.boxShadow =
        shadowX.toFixed(1) + "px " + shadowY.toFixed(1) + "px 60px rgba(0,0,0,0.28), " +
        (shadowX * 0.3).toFixed(1) + "px " + (shadowY * 0.3).toFixed(1) + "px 20px rgba(0,0,0,0.12), " +
        "inset 0 0 0 1px rgba(255,255,255,0.06)";
    }

    if (shine) {
      shine.style.setProperty("--shine-x", (current.x * 100).toFixed(1) + "%");
      shine.style.setProperty("--shine-y", (current.y * 100).toFixed(1) + "%");
    }

    var settled =
      Math.abs(current.x - target.x) < 0.001 &&
      Math.abs(current.y - target.y) < 0.001;

    if (isHovering || !settled) {
      rafId = requestAnimationFrame(animate);
    } else {
      inner.style.transform = "";
      rafId = null;
    }
  }
})();

/* ============ Floating App Icons – Brain Burst ============ */
(function initFloatingIcons() {
  var inner = document.getElementById("portraitInner");
  if (!inner) return;

  // Collect app logo sources from the page
  var logoSrcs = [];
  var kwiklyze = document.querySelector('img[alt*="KwikLyze"]');
  if (kwiklyze) logoSrcs.push(kwiklyze.getAttribute("src"));
  document.querySelectorAll(".app-icon-card .logo-icon img").forEach(function (img) {
    logoSrcs.push(img.getAttribute("src"));
  });
  if (logoSrcs.length === 0) return;

  // Arc geometry – semicircle curving over the head
  var HEAD_CX = 0.50;    // head horizontal center (fraction of width)
  var HEAD_CY = 0.32;    // head vertical center (fraction of height)
  var ARC_RADIUS = 0.28; // arc radius (fraction of height)
  var START_ANGLE = 140;  // left end of arc (degrees)
  var END_ANGLE = 40;     // right end of arc (degrees)

  // Per-icon visual config: sizes taper at edges, largest at top
  var configs = [
    { size: 38, rot: -10, bob: -5, dur: 4.2, delay: 0.28 },
    { size: 40, rot: -5,  bob: -7, dur: 3.7, delay: 0.16 },
    { size: 44, rot:  2,  bob: -6, dur: 4.0, delay: 0.0 },
    { size: 44, rot: -2,  bob: -6, dur: 3.5, delay: 0.06 },
    { size: 40, rot:  5,  bob: -7, dur: 3.9, delay: 0.18 },
    { size: 38, rot:  10, bob: -5, dur: 4.5, delay: 0.30 },
  ];

  var count = Math.min(logoSrcs.length, configs.length);
  var angleStep = count > 1 ? (START_ANGLE - END_ANGLE) / (count - 1) : 0;
  var icons = [];

  function positionAll() {
    var w = inner.offsetWidth;
    var h = inner.offsetHeight;
    var cx = HEAD_CX * w;
    var cy = HEAD_CY * h;
    var r = ARC_RADIUS * h;

    icons.forEach(function (obj, idx) {
      var angleDeg = START_ANGLE - idx * angleStep;
      var rad = angleDeg * Math.PI / 180;
      var s = obj.config;
      obj.el.style.left = (cx + r * Math.cos(rad) - s.size / 2) + "px";
      obj.el.style.top = (cy - r * Math.sin(rad) - s.size / 2) + "px";
    });
  }

  // Create icon elements inside portrait-inner so they clip to the frame
  for (var i = 0; i < count; i++) {
    var c = configs[i];
    var img = document.createElement("img");
    img.src = logoSrcs[i];
    img.alt = "";
    img.className = "floating-app-icon";
    img.draggable = false;
    img.style.width = c.size + "px";
    img.style.height = c.size + "px";
    img.style.setProperty("--r", c.rot + "deg");
    img.style.setProperty("--bob", c.bob + "px");
    img.style.setProperty("--dur", c.dur + "s");
    inner.appendChild(img);
    icons.push({ el: img, config: c });
  }

  positionAll();
  window.addEventListener("resize", positionAll);

  // Stagger pop-in after page settles
  var BASE_DELAY = 900;
  icons.forEach(function (obj) {
    var c = obj.config;
    setTimeout(function () {
      obj.el.classList.add("popped");
      setTimeout(function () {
        obj.el.classList.add("floating");
      }, 650);
    }, BASE_DELAY + c.delay * 1000);
  });
})();
