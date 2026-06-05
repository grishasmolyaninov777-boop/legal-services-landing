const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelectorAll(".main-nav a");
const contactForm = document.querySelector("[data-contact-form]");

menuToggle?.addEventListener("click", () => {
  header?.classList.toggle("is-open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header?.classList.remove("is-open");
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button");

  if (!button) {
    return;
  }

  button.textContent = "Заявка подготовлена";
  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = "Отправить заявку";
    button.disabled = false;
    contactForm.reset();
  }, 2200);
});
