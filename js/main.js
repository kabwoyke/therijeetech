(function () {
  "use strict";

  var WA_NUMBER = "254720620358";

  function waUrl(message) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
  }

  /* ---------- Mobile navigation ---------- */
  function initMobileNav() {
    var toggle = document.getElementById("menu-toggle");
    var menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;

    var openIcon = toggle.innerHTML;
    var isOpen = false;

    function setOpen(next) {
      isOpen = next;
      menu.classList.toggle("hidden", !isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      toggle.innerHTML = isOpen
        ? '<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg>'
        : openIcon;
    }

    toggle.addEventListener("click", function () {
      setOpen(!isOpen);
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768 && isOpen) setOpen(false);
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el, index) {
      el.style.transitionDelay = Math.min(index % 4, 3) * 70 + "ms";
      observer.observe(el);
    });
  }

  /* ---------- Book Trial form -> WhatsApp ---------- */
  function initTrialForm() {
    var form = document.getElementById("trial-form");
    if (!form) return;
    var statusEl = document.getElementById("trial-form-status");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var guardian = form.guardianName.value.trim();
      var student = form.studentName.value.trim();
      var age = form.studentAge.value.trim();
      var program = form.program.value;
      var phone = form.phoneNumber.value.trim();
      var message = form.message.value.trim();

      var missing = [];
      if (!guardian) missing.push("Parent/Guardian Name");
      if (!student) missing.push("Student Name");
      if (!age) missing.push("Student Age");
      if (!program) missing.push("Preferred Program");
      if (!phone) missing.push("Phone Number");

      if (missing.length) {
        if (statusEl) {
          statusEl.textContent = "Please fill in: " + missing.join(", ") + ".";
          statusEl.classList.remove("hidden");
        }
        return;
      }

      if (statusEl) statusEl.classList.add("hidden");

      var lines = [
        "Hello THE RIJEE TECH,",
        "",
        "I would like to book a free trial class.",
        "",
        "Parent/Guardian Name: " + guardian,
        "Student Name: " + student,
        "Student Age: " + age,
        "Preferred Program: " + program,
        "Phone Number: " + phone,
        "Message: " + (message || "-"),
      ];

      window.open(waUrl(lines.join("\n")), "_blank", "noopener");
    });
  }

  /* ---------- Contact page inquiry form -> WhatsApp ---------- */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var statusEl = document.getElementById("contact-form-status");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = form.fullName.value.trim();
      var phone = form.phoneNumber.value.trim();
      var message = form.message.value.trim();

      if (!name || !phone || !message) {
        if (statusEl) {
          statusEl.textContent = "Please fill in your name, phone number, and message.";
          statusEl.classList.remove("hidden");
        }
        return;
      }

      if (statusEl) statusEl.classList.add("hidden");

      var lines = [
        "Hello THE RIJEE TECH,",
        "",
        "Name: " + name,
        "Phone Number: " + phone,
        "Message: " + message,
      ];

      window.open(waUrl(lines.join("\n")), "_blank", "noopener");
    });
  }

  /* ---------- Photo carousels (scroll-snap, buttons scroll by one viewport-ish step) ---------- */
  function initCarousels() {
    var prevButtons = document.querySelectorAll("[data-carousel-prev]");
    var nextButtons = document.querySelectorAll("[data-carousel-next]");
    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function scrollTrack(id, direction) {
      var track = document.getElementById(id);
      if (!track) return;
      var amount = track.clientWidth * 0.9 * direction;
      track.scrollBy({ left: amount, behavior: prefersReduced ? "auto" : "smooth" });
    }

    prevButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        scrollTrack(btn.getAttribute("data-carousel-prev"), -1);
      });
    });
    nextButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        scrollTrack(btn.getAttribute("data-carousel-next"), 1);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initReveal();
    initTrialForm();
    initContactForm();
    initCarousels();
  });
})();
