const products = {
  sol: {
    name: "Pulsera Sol",
    category: "Pulseras",
    description: "Una pieza luminosa y delicada para acompañarte todos los días.",
    images: [
      ["assets/pulsera-ambar-piedra.webp", "Pulsera Sol sobre una superficie de piedra clara"],
      ["assets/pulsera-ambar-seda.webp", "Pulsera Sol sobre tela color marfil"],
      ["assets/pulsera-ambar-marmol.webp", "Pulsera Sol sobre mármol blanco"]
    ]
  },
  alba: {
    name: "Aretes Alba",
    category: "Aretes",
    description: "Un punto de color sutil que ilumina el rostro con elegancia serena.",
    images: [["assets/aretes-rosa-ebano.webp", "Aretes Alba en tono rosa sobre fondo oscuro"]]
  },
  prisma: {
    name: "Pulsera Prisma",
    category: "Colección Luz",
    description: "Un detalle iridiscente que cambia con la luz y transforma lo cotidiano.",
    images: [["assets/pulsera-prisma.webp", "Pulsera Prisma llevada en la muñeca"]]
  }
};

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const modal = document.querySelector("#product-modal");
const modalImage = document.querySelector("#modal-image");
const modalThumbs = document.querySelector("#modal-thumbs");
const toast = document.querySelector("#toast");
let lastFocused = null;
let toastTimer;

document.querySelector("#current-year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  mainNav.classList.toggle("is-open", !open);
});

mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuToggle.setAttribute("aria-expanded", "false");
  mainNav.classList.remove("is-open");
}));

const applyFilter = (filter) => {
  let visibleCount = 0;
  document.querySelectorAll(".filter").forEach((button) => {
    const active = button.dataset.filter === filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll(".product-card").forEach((card) => {
    const visible = filter === "todos" || card.dataset.category.split(" ").includes(filter);
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  document.querySelector(".empty-state").hidden = visibleCount !== 0;
};

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => applyFilter(button.dataset.filter));
});

document.querySelectorAll("[data-set-filter]").forEach((link) => {
  link.addEventListener("click", () => applyFilter(link.dataset.setFilter));
});

const selectModalImage = (product, index) => {
  const [src, alt] = product.images[index];
  modalImage.src = src;
  modalImage.alt = alt;
  modalThumbs.querySelectorAll("button").forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === index);
    button.setAttribute("aria-pressed", String(buttonIndex === index));
  });
};

const openProduct = (key) => {
  const product = products[key];
  if (!product) return;
  lastFocused = document.activeElement;
  document.querySelector("#modal-title").textContent = product.name;
  document.querySelector("#modal-category").textContent = product.category;
  document.querySelector("#modal-description").textContent = product.description;
  modalThumbs.replaceChildren();
  product.images.forEach(([src, alt], index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Ver imagen ${index + 1} de ${product.name}`);
    button.setAttribute("aria-pressed", String(index === 0));
    button.innerHTML = `<img src="${src}" alt="${alt}">`;
    button.addEventListener("click", () => selectModalImage(product, index));
    modalThumbs.append(button);
  });
  selectModalImage(product, 0);
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close").focus();
};

const closeModal = () => {
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  if (lastFocused) lastFocused.focus();
};

document.querySelectorAll(".product-card").forEach((card) => {
  card.querySelector(".product-image").addEventListener("click", () => openProduct(card.dataset.product));
});
document.querySelectorAll("[data-modal-close]").forEach((button) => button.addEventListener("click", closeModal));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
  if (event.key === "Tab" && !modal.hidden) {
    const focusable = [...modal.querySelectorAll("button:not([disabled]), a[href]")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

const whatsappNumber = "593984813531";
const whatsappMessage =
  "Hola, quisiera conocer más sobre Nativa, me podrías ayudar enviando el catálogo completo?.";

document.querySelectorAll("[data-contact]").forEach((button) => {
  button.addEventListener("click", () => {
    const whatsappURL =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
