document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const navToggle = document.querySelector(".nav__toggle");
  const navList = document.getElementById("nav-menu");
  const yearEl = document.getElementById("year");

  const updateHeader = () => {
    if (!header) return;
    const scrolled = window.scrollY > 8;
    header.classList.toggle("scrolled", scrolled);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navList.setAttribute("aria-expanded", String(!expanded));
    });

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

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-status");

  if (contactForm) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    const apiBase = String(window.API_BASE_URL || "").trim();
    const endpoint = apiBase
      ? `${apiBase.replace(/\/$/, "")}/send-mail`
      : "/send-mail";

    contactForm.action = endpoint;

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (contactStatus) {
        contactStatus.hidden = false;
        contactStatus.textContent = "Sending message...";
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const payload = {
        name: nameInput ? String(nameInput.value || "").trim() : "",
        email: emailInput ? String(emailInput.value || "").trim() : "",
        message: messageInput ? String(messageInput.value || "").trim() : "",
      };

      try {
        const res = await fetch(contactForm.action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data && data.success) {
          if (contactStatus) {
            contactStatus.textContent = "Thanks! Your message was sent.";
          }
          contactForm.reset();
        } else {
          const msg =
            (data && data.message) ||
            `Request failed with status ${res.status}`;
          if (contactStatus) contactStatus.textContent = msg;
        }
      } catch (err) {
        console.error(err);
        if (contactStatus)
          contactStatus.textContent = "Network error. Try again.";
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId.length <= 1) return;
      const el = document.querySelector(targetId);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const revealEls = document.querySelectorAll(".reveal");
  const reveal = (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.transition = "opacity 600ms ease, transform 600ms ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      observer.unobserve(el);
    });
  };
  const observer = new IntersectionObserver(reveal, { threshold: 0.1 });
  revealEls.forEach((el) => {
    observer.observe(el);
  });
});
