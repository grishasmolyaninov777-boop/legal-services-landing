const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelectorAll(".main-nav a");
const contactForm = document.querySelector("[data-contact-form]");
const heroForm = document.querySelector("[data-hero-form]");
const modal = document.querySelector("[data-modal]");
const modalOpeners = document.querySelectorAll("[data-modal-open]");
const modalClosers = document.querySelectorAll("[data-modal-close]");
const modalForm = document.querySelector("[data-modal-form]");

const openModal = () => {
  if (!modal) return;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  window.setTimeout(() => {
    modal.querySelector("input")?.focus();
  }, 180);
};

const closeModal = () => {
  if (!modal) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

menuToggle?.addEventListener("click", () => {
  header?.classList.toggle("is-open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header?.classList.remove("is-open");
  });
});

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

const markSubmitted = (form, text) => {
  const button = form.querySelector("button");

  if (!button) return;

  const originalText = button.textContent;
  button.textContent = text;
  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
    form.reset();
  }, 2200);
};

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  markSubmitted(contactForm, "Заявка отправлена");
});

heroForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  markSubmitted(heroForm, "Скоро перезвоним");
});

modalForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  markSubmitted(modalForm, "Мы скоро перезвоним");

  window.setTimeout(() => {
    closeModal();
  }, 1500);
});

const revealItems = document.querySelectorAll(".reveal");

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
    { threshold: 0.12 }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
