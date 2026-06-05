const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelectorAll(".main-nav a");
const modal = document.querySelector("[data-modal]");
const modalOpeners = document.querySelectorAll("[data-modal-open]");
const modalClosers = document.querySelectorAll("[data-modal-close]");
const bookingForms = document.querySelectorAll("[data-booking-form]");
const revealItems = document.querySelectorAll(".reveal");
const countItems = document.querySelectorAll("[data-count]");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const magneticItems = document.querySelectorAll("[data-magnetic]");
const tiltCards = document.querySelectorAll("[data-tilt-card]");
const progress = document.querySelector("[data-scroll-progress]");
const cursorGlow = document.querySelector("[data-cursor-glow]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.lucide?.createIcons({ strokeWidth: 1.8 });

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setProgress = () => {
  if (!progress) return;

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.min(value, 100)}%`;
};

const updateParallax = () => {
  if (reducedMotion) return;

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.speed || 0);
    const rect = item.getBoundingClientRect();
    const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
    item.style.setProperty("--parallax-y", `${centerOffset * speed}px`);
  });
};

let ticking = false;

const onScroll = () => {
  if (ticking) return;

  ticking = true;
  window.requestAnimationFrame(() => {
    setHeaderState();
    setProgress();
    updateParallax();
    ticking = false;
  });
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
setHeaderState();
setProgress();
updateParallax();

menuToggle?.addEventListener("click", () => {
  header?.classList.toggle("is-open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header?.classList.remove("is-open");
  });
});

const openModal = () => {
  if (!modal) return;

  modal.hidden = false;
  modal.classList.add("is-open");
  document.body.classList.add("modal-open");

  window.setTimeout(() => {
    modal.querySelector("input")?.focus();
  }, 180);
};

const closeModal = () => {
  if (!modal) return;

  modal.classList.remove("is-open");
  document.body.classList.remove("modal-open");

  window.setTimeout(() => {
    if (!modal.classList.contains("is-open")) {
      modal.hidden = true;
    }
  }, 260);
};

modalOpeners.forEach((button) => {
  button.addEventListener("click", openModal);
});

modalClosers.forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

const animateCount = (item) => {
  const target = Number(item.dataset.count || 0);
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progressValue = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progressValue, 3);
    const value = Math.round(target * eased);
    item.textContent = `${value.toLocaleString("ru-RU")}+`;

    if (progressValue < 1) {
      window.requestAnimationFrame(tick);
    }
  };

  window.requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        if (entry.target.matches("[data-count]")) {
          animateCount(entry.target);
        }

        entry.target.querySelectorAll?.("[data-count]").forEach((item) => {
          if (!item.dataset.animated) {
            item.dataset.animated = "true";
            animateCount(item);
          }
        });

        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 70}ms`);
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  countItems.forEach(animateCount);
}

if ("IntersectionObserver" in window) {
  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const activeLink = document.querySelector(`.main-nav a[href="#${entry.target.id}"]`);
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("is-active"));
          activeLink?.classList.add("is-active");
        }
      });
    },
    { threshold: 0.35, rootMargin: "-20% 0px -45% 0px" }
  );

  sections.forEach((section) => navObserver.observe(section));
}

const markSubmitted = (form) => {
  const button = form.querySelector("button[type='submit']");
  if (!button) return;

  const original = button.dataset.originalHtml || button.innerHTML;
  button.dataset.originalHtml = original;
  button.disabled = true;
  button.textContent = "Заявка отправлена";

  window.setTimeout(() => {
    button.disabled = false;
    button.innerHTML = original;
    window.lucide?.createIcons({ strokeWidth: 1.8 });
    form.reset();

    if (form.closest("[data-modal]")) {
      closeModal();
    }
  }, 1800);
};

bookingForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    markSubmitted(form);
  });
});

document.querySelectorAll("input[type='date']").forEach((input) => {
  input.min = new Date().toISOString().split("T")[0];
});

document.querySelectorAll("input[type='tel']").forEach((input) => {
  input.addEventListener("input", () => {
    let digits = input.value.replace(/\D/g, "");
    digits = digits.replace(/^8/, "7");
    if (digits && !digits.startsWith("7")) {
      digits = `7${digits}`;
    }
    digits = digits.slice(0, 11);
    const parts = [];

    if (digits.length > 0) parts.push("+7");
    if (digits.length > 1) parts.push(` (${digits.slice(1, 4)}`);
    if (digits.length >= 4) parts[1] += ")";
    if (digits.length > 4) parts.push(` ${digits.slice(4, 7)}`);
    if (digits.length > 7) parts.push(`-${digits.slice(7, 9)}`);
    if (digits.length > 9) parts.push(`-${digits.slice(9, 11)}`);

    input.value = parts.join("");
  });
});

if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  magneticItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.2;
      item.style.setProperty("--magnetic-x", `${x}px`);
      item.style.setProperty("--magnetic-y", `${y}px`);
    });

    item.addEventListener("pointerleave", () => {
      item.style.setProperty("--magnetic-x", "0px");
      item.style.setProperty("--magnetic-y", "0px");
    });
  });

  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${y * -5}deg`);
      card.style.setProperty("--tilt-y", `${x * 6}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });

  document.addEventListener("pointermove", (event) => {
    if (!cursorGlow) return;

    cursorGlow.style.opacity = "1";
    cursorGlow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
  });
}
