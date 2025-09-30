document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const navToggle = document.querySelector(".nav__toggle");
  const navList = document.getElementById("nav-menu");
  const yearEl = document.getElementById("year");

  // Sticky header on scroll
  const updateHeader = () => {
    const scrolled = window.scrollY > 8;
    header.classList.toggle("scrolled", scrolled);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Mobile nav toggle
  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navList.setAttribute("aria-expanded", String(!expanded));
    });

    // Close on link click (mobile)
    navList.addEventListener("click", (e) => {
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        target.tagName.toLowerCase() === "a"
      ) {
        navToggle.setAttribute("aria-expanded", "false");
        navList.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Footer year
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Track form mock
  const trackForm = document.getElementById("track-form");
  const trackHint = document.getElementById("track-hint");
  const trackResult = document.getElementById("track-result");
  if (trackForm) {
    trackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("tracking-number");
      const tn = input && "value" in input ? input.value.trim() : "";
      if (!tn) {
        if (trackHint)
          trackHint.textContent = "Enter a tracking number (e.g., SHIP123456).";
        return;
      }
      if (trackHint) trackHint.textContent = "";
      if (trackResult) {
        trackResult.hidden = false;
        trackResult.textContent = `Status for ${tn}: In transit • ETA 2-3 days`;
      }
    });
  }

  // Newsletter mock
  const newsletter = document.getElementById("newsletter-form");
  const newsletterHint = document.getElementById("newsletter-hint");
  if (newsletter) {
    newsletter.addEventListener("submit", (e) => {
      e.preventDefault();
      if (newsletterHint)
        newsletterHint.textContent = "Thanks! You're subscribed.";
    });
  }
});

// Sticky header on scroll
const header = document.getElementById("site-header");
const updateHeaderOnScroll = () => {
  if (!header) return;
  const scrolled = window.scrollY > 8;
  header.classList.toggle("scrolled", scrolled);
};
updateHeaderOnScroll();
window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });

// Mobile nav toggle
const navToggle = document.querySelector(".nav__toggle");
const navMenu = document.getElementById("nav-menu");
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navMenu.setAttribute("aria-expanded", String(!expanded));
  });
  navMenu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.setAttribute("aria-expanded", "false");
    })
  );
}

// Smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId.length === 1) return;
    const el = document.querySelector(targetId);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Simple tracking demo handler (fake response)
const trackForm = document.getElementById("track-form");
const trackInput = document.getElementById("tracking-number");
const trackHint = document.getElementById("track-hint");
const trackResult = document.getElementById("track-result");
if (trackForm && trackInput && trackHint && trackResult) {
  trackForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = trackInput.value.trim();
    if (!value) {
      trackHint.textContent = "Please enter a tracking number.";
      trackResult.hidden = true;
      return;
    }
    if (!/^([A-Z]{2,4})?\d{6,}$/i.test(value)) {
      trackHint.textContent = "That tracking number looks invalid.";
      trackResult.hidden = true;
      return;
    }
    trackHint.textContent = "";
    trackResult.hidden = false;
    const now = new Date();
    trackResult.innerHTML = `
      <strong>Status:</strong> In Transit<br>
      <strong>Last scan:</strong> ${now.toLocaleString()}<br>
      <strong>ETA:</strong> ${new Date(
        now.getTime() + 3 * 24 * 60 * 60 * 1000
      ).toLocaleDateString()}
    `;
  });
}

// Newsletter form feedback
const newsletterForm = document.getElementById("newsletter-form");
const emailInput = document.getElementById("email");
const newsletterHint = document.getElementById("newsletter-hint");
if (newsletterForm && emailInput && newsletterHint) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = String(emailInput.value || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newsletterHint.textContent = "Enter a valid email address.";
      return;
    }
    newsletterHint.textContent = "Thanks! We'll keep you posted.";
    newsletterForm.reset();
  });
}

// Scroll-reveal animations (fade + slide up)
const revealEls = document.querySelectorAll(
  ".section, .card, .service, .promo__grid, .hero__content"
);
const reveal = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.transition =
        "opacity 600ms ease, transform 600ms ease";
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    }
  });
};
const observer = new IntersectionObserver(reveal, { threshold: 0.12 });
revealEls.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(18px)";
  observer.observe(el);
});

// Set current year in footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
