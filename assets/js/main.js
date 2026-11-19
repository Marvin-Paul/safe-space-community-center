/* Safe Space Community Center —— interactions */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header, progress, back-to-top, parallax ---------- */
  const header = $("#siteHeader");
  const progressBar = $("#progressBar");
  const toTop = $(".to-top");
  const heroArt = $(".hero-art");
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;

    if (header) header.classList.toggle("scrolled", y > 12);

    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }

    if (toTop) toTop.classList.toggle("show", y > 700);

    if (heroArt && !reduceMotion && y < window.innerHeight * 1.3) {
      heroArt.style.transform = `translateY(${(y * 0.055).toFixed(2)}px)`;
    }

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Mobile navigation ---------- */
  const menuToggle = $(".menu-toggle");
  const nav = $("#primaryNav");

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    if (nav) nav.classList.remove("open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = !nav.classList.contains("open");
      document.body.classList.toggle("menu-open", open);
      nav.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    $$("a", nav).forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("open")) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) closeMenu();
    });
  }

  /* ---------- Active navigation link ---------- */
  const navLinks = $$(".nav a[href^='#']");
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach((link) => {
            if (link.getAttribute("href") === id) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- Marquee duplication ---------- */
  const track = $(".marquee-track");
  if (track) track.innerHTML += track.innerHTML;

  /* ---------- Stagger delays ---------- */
  $$("[data-stagger]").forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      child.style.setProperty("--d", index * 70 + "ms");
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Counters ---------- */
  const counters = $$("[data-count]");
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (reduceMotion) {
      el.textContent = String(target);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  };

  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
    } else {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => counterObserver.observe(el));
    }
  }

  /* ---------- Accordion ---------- */
  const accordion = $("[data-accordion]");
  if (accordion) {
    const items = $$(".acc-item", accordion);

    const setHeight = (item) => {
      const panel = $(".acc-panel", item);
      if (!panel) return;
      panel.style.maxHeight = item.classList.contains("is-open")
        ? panel.scrollHeight + "px"
        : "0px";
    };

    items.forEach((item) => {
      const trigger = $(".acc-trigger", item);
      if (!trigger) return;

      trigger.addEventListener("click", () => {
        const wasOpen = item.classList.contains("is-open");

        items.forEach((other) => {
          other.classList.remove("is-open");
          const otherTrigger = $(".acc-trigger", other);
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
          setHeight(other);
        });

        if (!wasOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          setHeight(item);
        }
      });
    });

    const initial = items.find((item) => item.classList.contains("is-open")) || items[0];
    if (initial) {
      initial.classList.add("is-open");
      const trigger = $(".acc-trigger", initial);
      if (trigger) trigger.setAttribute("aria-expanded", "true");
      window.requestAnimationFrame(() => setHeight(initial));
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => items.forEach(setHeight), 150);
    });
  }

  /* ---------- Contact form ---------- */  const form = $("#contactForm");
  if (form) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const setError = (input, message) => {
      const field = input.closest(".field");
      if (!field) return;
      field.classList.add("has-error");
      input.setAttribute("aria-invalid", "true");
      const slot = field.querySelector(".error");
      if (slot) slot.textContent = message;
    };

    const clearError = (input) => {
      const field = input.closest(".field");
      if (!field) return;
      field.classList.remove("has-error");
      input.removeAttribute("aria-invalid");
      const slot = field.querySelector(".error");
      if (slot) slot.textContent = "";
    };

    $$("input, textarea", form).forEach((input) => {
      input.addEventListener("input", () => clearError(input));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = $("#name", form);
      const email = $("#email", form);
      const message = $("#message", form);
      let valid = true;

      [name, email, message].forEach((input) => {
        if (input) clearError(input);
      });

      if (!name || name.value.trim().length < 2) {
        if (name) setError(name, "Please tell us your name.");
        valid = false;
      }
      if (!email || !emailPattern.test(email.value.trim())) {
        if (email) setError(email, "Please enter a valid email address.");
        valid = false;
      }
      if (!message || message.value.trim().length < 10) {
        if (message) setError(message, "Please add a little more detail (10 characters or more).");
        valid = false;
      }

      if (!valid) {
        const firstError = form.querySelector(".has-error input, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      const data = new FormData(form);
      const subject = `Website enquiry —— ${data.get("topic") || "General"}`;
      const body = [
        `Name: ${data.get("name") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Phone: ${data.get("phone") || "——"}`,
        `Topic: ${data.get("topic") || ""}`,
        "",
        String(data.get("message") || ""),
      ].join("\n");

      window.location.href =
        "mailto:safespacecc01@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      const success = $(".form-success", form);
      if (success) success.hidden = false;
      form.reset();
    });
  }
  /* ---------- Donor form ---------- */
  const donorForm = $("#donorForm");
  if (donorForm) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    donorForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = $("#donor-name", donorForm);
      const email = $("#donor-email", donorForm);
      const interest = $("#donor-interest", donorForm);
      const message = $("#donor-message", donorForm);
      let valid = true;

      [name, email].forEach((input) => {
        if (input) {
          const field = input.closest(".field");
          if (field) field.classList.remove("has-error");
          input.removeAttribute("aria-invalid");
          const slot = field ? field.querySelector(".error") : null;
          if (slot) slot.textContent = "";
        }
      });

      if (!name || name.value.trim().length < 2) {
        if (name) {
          const field = name.closest(".field");
          if (field) {
            field.classList.add("has-error");
            name.setAttribute("aria-invalid", "true");
            const slot = field.querySelector(".error");
            if (slot) slot.textContent = "Please tell us your name or organisation.";
          }
        }
        valid = false;
      }
      if (!email || !emailPattern.test(email.value.trim())) {
        if (email) {
          const field = email.closest(".field");
          if (field) {
            field.classList.add("has-error");
            email.setAttribute("aria-invalid", "true");
            const slot = field.querySelector(".error");
            if (slot) slot.textContent = "Please enter a valid email address.";
          }
        }
        valid = false;
      }

      if (!valid) {
        const firstError = donorForm.querySelector(".has-error input");
        if (firstError) firstError.focus();
        return;
      }

      const subject = "Donor enquiry — " + (interest ? interest.value : "General");
      const body = [
        "Name / Organisation: " + (name ? name.value : ""),
        "Email: " + (email ? email.value : ""),
        "Interest: " + (interest ? interest.value : ""),
        "",
        (message ? message.value : ""),
      ].join("\n");

      window.location.href =
        "mailto:safespacecc01@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      const success = $(".form-success", donorForm);
      if (success) success.hidden = false;
      donorForm.reset();
    });
  }
})();

