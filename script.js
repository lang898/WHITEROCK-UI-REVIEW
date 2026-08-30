const products = Array.isArray(window.WR_PRODUCTS) ? window.WR_PRODUCTS : [];
const colors = Array.isArray(window.WR_COLORS) ? window.WR_COLORS : [];
const finishes = Array.isArray(window.WR_FINISHES) ? window.WR_FINISHES : [];
const edges = Array.isArray(window.WR_EDGES) ? window.WR_EDGES : [];
const resources = window.WR_RESOURCES || { items: [] };
const applications = window.WR_APPLICATIONS || { items: [] };
const siteConfig = window.WR_SITE || {};

const productGrid = document.querySelector("#productGrid");
const productFilters = document.querySelectorAll(".filter[data-filter]");
const searchInput = document.querySelector("#productSearch");
const searchDrawer = document.querySelector("#searchDrawer");
const searchToggle = document.querySelector("#searchToggle");
const menuToggle = document.querySelector("#menuToggle");
const mobilePanel = document.querySelector("#mobilePanel");
const navTriggers = Array.from(document.querySelectorAll(".nav-trigger"));

let currentFilter = "All";
let activeProduct = null;
let activeColor = null;
let lastFocused = null;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderPicture(item, field, alt, className = "") {
  const image = item[field];
  const webp = field === "swatchImage" ? item.swatchImageWebp : item.imageWebp;
  return `<picture${className ? ` class="${className}"` : ""}><source srcset="${escapeHtml(webp || image)}" type="image/webp" /><img src="${escapeHtml(image)}" alt="${escapeHtml(alt)}" width="${Number(item.imageWidth) || 1200}" height="${Number(item.imageHeight) || 900}" loading="lazy" decoding="async" /></picture>`;
}

function renderProducts() {
  if (!productGrid) return;
  const query = (searchInput?.value || "").toLowerCase().trim();
  const filtered = products.filter((product) => {
    const filterMatch = currentFilter === "All" || product.category === currentFilter;
    const haystack = `${product.title} ${product.category} ${product.material} ${product.description} ${product.sku}`.toLowerCase();
    return filterMatch && (!query || haystack.includes(query));
  });

  productGrid.innerHTML = filtered.map((product) => {
    const index = products.indexOf(product);
    const isRender = product.imageType !== "real";
    return `<article class="product-card" tabindex="0" role="button" aria-label="View ${escapeHtml(product.title)}" data-index="${index}">
      <figure class="product-visual">${renderPicture(product, "image", `${product.title}${isRender ? " illustrative render" : ""}`)}${isRender ? '<figcaption>Illustrative render — not actual product.</figcaption>' : ""}</figure>
      <div class="product-card-body"><p class="eyebrow">${escapeHtml(product.category)}</p><h3>${escapeHtml(product.title)}</h3><p>${escapeHtml(product.description)}</p><div class="product-meta"><span>${escapeHtml(product.sku)}</span><span>${escapeHtml(product.material)}</span><span>MOQ ${escapeHtml(product.specs?.MOQ || "by project")}</span></div><div class="product-card-actions"><button type="button" class="button small product-details-button" data-product-action="details" data-index="${index}">Details</button><button type="button" class="button small quick-inquiry-add" data-inquiry-sku="${escapeHtml(product.sku)}">Add to inquiry</button><button type="button" class="compare-toggle" data-compare-kind="product" data-compare-id="${escapeHtml(product.sku)}" aria-label="Compare ${escapeHtml(product.title)}" aria-pressed="false">Compare</button></div></div>
    </article>`;
  }).join("");

  if (!filtered.length) productGrid.innerHTML = '<p class="empty-state">No products matched this search. Try another material or category.</p>';
}

function mapInterest(category) {
  const map = {
    "Bathroom Vanity Top": "Bathroom vanity tops",
    "Kitchen Countertop": "Kitchen countertops",
    "Stone Furniture": "Stone furniture",
    "Commercial Project": "Custom commercial project",
  };
  return map[category] || "Material samples";
}

function applyPrefill(form, data) {
  const select = form.querySelector('select[name="interest"]');
  if (select && data.interest) {
    const match = Array.from(select.options).find((option) => option.value === data.interest || option.textContent === data.interest);
    if (match) select.value = match.value;
  }
  const textarea = form.querySelector('textarea[name="message"]');
  if (textarea && data.sku) {
    const line = `Product of interest: ${data.sku} — ${data.title}`;
    if (!textarea.value.includes(data.sku)) textarea.value = textarea.value ? `${line}\n\n${textarea.value}` : `${line}\n\n`;
  }
}

function requestQuoteFor(product) {
  if (!product) return;
  const data = { sku: product.sku, title: product.title, interest: mapInterest(product.category) };
  const form = document.querySelector("#inquiryForm");
  if (form) applyPrefill(form, data);
  else {
    try { sessionStorage.setItem("wr_inquiry", JSON.stringify(data)); } catch {}
  }
}

function addProductToInquiry(product, button) {
  if (!product) return;
  window.wrInquiry?.add({ sku: product.sku, title: product.title });
  if (!window.wrInquiry) {
    try { sessionStorage.setItem("wr_inquiry", JSON.stringify({ sku: product.sku, title: product.title, interest: mapInterest(product.category) })); } catch {}
  }
  if (button) {
    const previous = button.textContent;
    button.textContent = "Added";
    button.classList.add("is-confirmed");
    setTimeout(() => {
      button.textContent = previous;
      button.classList.remove("is-confirmed");
    }, 1400);
  }
}

function openModal(modal) {
  if (!modal) return;
  lastFocused = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal-close")?.focus();
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  activeProduct = null;
  activeColor = null;
  if (lastFocused instanceof HTMLElement) lastFocused.focus();
}

function openProduct(index) {
  const product = products[index];
  const modal = document.querySelector("#productModal");
  if (!product || !modal) return;
  activeProduct = product;
  const isRender = product.imageType !== "real";
  const image = modal.querySelector("#modalImage");
  image.src = product.imageWebp || product.image;
  image.alt = `${product.title}${isRender ? " illustrative render" : ""}`;
  image.width = product.imageWidth || 1200;
  image.height = product.imageHeight || 900;
  modal.querySelector("#modalCaption").hidden = !isRender;
  modal.querySelector("#modalCategory").textContent = product.category;
  modal.querySelector("#modalTitle").textContent = product.title;
  modal.querySelector("#modalDescription").textContent = product.description;
  modal.querySelector("#modalSpecs").innerHTML = Object.entries(product.specs || {}).map(([key, value]) => `<dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd>`).join("");
  const specLink = modal.querySelector("#productTechSheet");
  specLink.hidden = !product.techSheetPdf;
  if (product.techSheetPdf) specLink.href = product.techSheetPdf;
  const relatedMaterial = ["Engineered Marble", "Granite", "Marble", "Quartz"].find((material) => product.material.includes(material));
  const relatedColors = modal.querySelector("#productRelatedColors");
  relatedColors.href = relatedMaterial ? `colors.html?material=${encodeURIComponent(relatedMaterial)}` : "colors.html";
  openModal(modal);
}

productFilters.forEach((button) => button.addEventListener("click", () => {
  productFilters.forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  currentFilter = button.dataset.filter;
  renderProducts();
}));

productGrid?.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-inquiry-sku]");
  if (addButton) {
    event.preventDefault();
    event.stopPropagation();
    const product = products.find((item) => item.sku === addButton.dataset.inquirySku);
    addProductToInquiry(product, addButton);
    return;
  }
  const detailButton = event.target.closest("[data-product-action='details']");
  if (detailButton) {
    event.preventDefault();
    event.stopPropagation();
    openProduct(Number(detailButton.dataset.index));
    return;
  }
  const card = event.target.closest(".product-card");
  if (card) openProduct(Number(card.dataset.index));
});

productGrid?.addEventListener("keydown", (event) => {
  if (event.target.closest("button, a, input, select, textarea")) return;
  const card = event.target.closest(".product-card");
  if (card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openProduct(Number(card.dataset.index));
  }
});

document.querySelectorAll(".product-guide-filter").forEach((button) => button.addEventListener("click", () => {
  const target = button.dataset.filterTarget || "All";
  const filterButton = Array.from(productFilters).find((item) => item.dataset.filter === target);
  if (filterButton) {
    productFilters.forEach((item) => item.classList.remove("active"));
    filterButton.classList.add("active");
    currentFilter = target;
    renderProducts();
    document.querySelector("#productGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}));

document.querySelector("#modalQuote")?.addEventListener("click", () => requestQuoteFor(activeProduct));

const colorGrid = document.querySelector("#colorGrid");
const colorMaterialFilter = document.querySelector("#colorMaterialFilter");
const colorFamilyFilter = document.querySelector("#colorFamilyFilter");
const colorFinishFilter = document.querySelector("#colorFinishFilter");
const selectedColorSlugs = new Set();
try {
  const storedColors = JSON.parse(sessionStorage.getItem("wr_sample_colors") || "[]");
  storedColors.slice(0, 4).forEach((slug) => selectedColorSlugs.add(slug));
} catch {}

function populateSelect(select, values) {
  if (!select) return;
  values.filter(Boolean).sort().forEach((value) => select.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`));
}

function initializeColorFilters() {
  populateSelect(colorMaterialFilter, [...new Set(colors.map((color) => color.material))]);
  populateSelect(colorFamilyFilter, [...new Set(colors.map((color) => color.colorFamily))]);
  populateSelect(colorFinishFilter, [...new Set(colors.flatMap((color) => color.finishes || []))]);
}

function filteredColors() {
  return colors.filter((color) =>
    (!colorMaterialFilter || colorMaterialFilter.value === "All" || color.material === colorMaterialFilter.value) &&
    (!colorFamilyFilter || colorFamilyFilter.value === "All" || color.colorFamily === colorFamilyFilter.value) &&
    (!colorFinishFilter || colorFinishFilter.value === "All" || (color.finishes || []).includes(colorFinishFilter.value))
  );
}

function renderColors() {
  if (!colorGrid) return;
  const visible = filteredColors();
  document.querySelector("#colorResults").textContent = `${visible.length} surface${visible.length === 1 ? "" : "s"}`;
  colorGrid.innerHTML = visible.map((color) => {
    const isSelected = selectedColorSlugs.has(color.slug);
    const isRender = color.imageType !== "real";
    return `<article class="swatch-card">
      <button class="swatch-open" type="button" data-color="${escapeHtml(color.slug)}" aria-label="View ${escapeHtml(color.name)} details"><figure>${renderPicture(color, "swatchImage", `${color.name}${isRender ? " illustrative render" : ""}`)}${isRender ? '<figcaption>Illustrative render</figcaption>' : ""}</figure></button>
      <div class="swatch-card-body"><div><p class="eyebrow">${escapeHtml(color.material)} · ${escapeHtml(color.colorFamily)}</p><h3>${escapeHtml(color.name)}</h3><p>${escapeHtml((color.finishes || []).join(" / "))}</p></div><button class="sample-toggle${isSelected ? " selected" : ""}" type="button" data-sample="${escapeHtml(color.slug)}" aria-pressed="${isSelected}">${isSelected ? "Selected" : "Add sample"}</button><button type="button" class="compare-toggle" data-compare-kind="color" data-compare-id="${escapeHtml(color.slug)}" aria-label="Compare ${escapeHtml(color.name)}" aria-pressed="false">Compare</button></div>
    </article>`;
  }).join("");
  if (!visible.length) colorGrid.innerHTML = '<p class="empty-state">No colors match all three filters. Clear one filter to broaden the library.</p>';
}

function updateSampleKit() {
  const selected = colors.filter((color) => selectedColorSlugs.has(color.slug));
  const panel = document.querySelector("#selectedSamples");
  const input = document.querySelector("#selectedColorsInput");
  if (panel) panel.innerHTML = selected.length
    ? selected.map((color) => `<button type="button" data-remove-sample="${escapeHtml(color.slug)}"><span class="sample-chip" style="background-image:url('${escapeHtml(color.swatchImageWebp || color.swatchImage)}')"></span><span>${escapeHtml(color.name)}</span><span aria-hidden="true">×</span></button>`).join("")
    : "<p>No colors selected yet.</p>";
  if (input) input.value = selected.map((color) => `${color.name} (${color.material})`).join(", ");
  try { sessionStorage.setItem("wr_sample_colors", JSON.stringify([...selectedColorSlugs])); } catch {}
  renderColors();
}

function toggleSample(slug) {
  const note = document.querySelector("#sampleKitForm [data-form-note]");
  if (selectedColorSlugs.has(slug)) selectedColorSlugs.delete(slug);
  else if (selectedColorSlugs.size < 4) selectedColorSlugs.add(slug);
  else {
    if (note) {
      note.textContent = "Your kit already has four colors. Remove one before adding another.";
      note.className = "form-note is-error";
    }
    return;
  }
  if (note) {
    note.textContent = selectedColorSlugs.size ? `${selectedColorSlugs.size} of 4 colors selected.` : "Select one to four colors above before submitting.";
    note.className = "form-note";
  }
  updateSampleKit();
}

function openColor(slug) {
  const color = colors.find((item) => item.slug === slug);
  const modal = document.querySelector("#colorModal");
  if (!color || !modal) return;
  activeColor = color;
  const isRender = color.imageType !== "real";
  const image = modal.querySelector("#colorModalImage");
  image.src = color.swatchImageWebp || color.swatchImage;
  image.alt = `${color.name}${isRender ? " illustrative render" : ""}`;
  image.width = color.imageWidth || 1200;
  image.height = color.imageHeight || 900;
  modal.querySelector("#colorModalCaption").hidden = !isRender;
  modal.querySelector("#colorModalMeta").textContent = `${color.material} · ${color.colorFamily}`;
  modal.querySelector("#colorModalName").textContent = color.name;
  modal.querySelector("#colorModalDescription").textContent = color.description;
  modal.querySelector("#colorModalFinishes").textContent = (color.finishes || []).join(", ");
  modal.querySelector("#colorModalThicknesses").textContent = (color.thicknesses || []).join(", ");
  modal.querySelector("#colorModalSizes").textContent = (color.sizes || []).join(", ");
  const relatedProducts = color.relatedProducts || [];
  const relatedNode = modal.querySelector("#colorModalRelatedProducts");
  if (relatedNode) relatedNode.textContent = relatedProducts.length ? relatedProducts.join(", ") : "Cut-to-size surfaces, custom fabrication";
  const specLink = modal.querySelector("#colorTechSheet");
  specLink.hidden = !color.techSheetPdf;
  if (color.techSheetPdf) specLink.href = color.techSheetPdf;
  modal.querySelector("#colorRelatedProducts").href = `products.html?q=${encodeURIComponent((relatedProducts[0] || color.material || "").replace(/s$/, ""))}`;
  const sampleButton = modal.querySelector("#colorSampleButton");
  sampleButton.textContent = selectedColorSlugs.has(color.slug) ? "Remove from sample kit" : "Add to sample kit";
  openModal(modal);
}

colorGrid?.addEventListener("click", (event) => {
  const sample = event.target.closest("[data-sample]");
  const opener = event.target.closest("[data-color]");
  if (sample) toggleSample(sample.dataset.sample);
  else if (opener) openColor(opener.dataset.color);
});

document.querySelector("#selectedSamples")?.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove-sample]");
  if (remove) toggleSample(remove.dataset.removeSample);
});

document.querySelector("#colorSampleButton")?.addEventListener("click", () => {
  if (!activeColor) return;
  const slug = activeColor.slug;
  toggleSample(slug);
  const button = document.querySelector("#colorSampleButton");
  button.textContent = selectedColorSlugs.has(slug) ? "Remove from sample kit" : "Add to sample kit";
});

[colorMaterialFilter, colorFamilyFilter, colorFinishFilter].forEach((select) => select?.addEventListener("change", renderColors));
document.querySelector("#clearColorFilters")?.addEventListener("click", () => {
  [colorMaterialFilter, colorFamilyFilter, colorFinishFilter].forEach((select) => { if (select) select.value = "All"; });
  renderColors();
});

document.querySelectorAll("[data-color-family-shortcut]").forEach((button) => button.addEventListener("click", () => {
  const family = button.dataset.colorFamilyShortcut;
  if (colorFamilyFilter && Array.from(colorFamilyFilter.options).some((option) => option.value === family)) {
    colorFamilyFilter.value = family;
    renderColors();
    document.querySelector("#colorGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}));

function renderReferenceCards(containerId, items, kind) {
  const container = document.querySelector(containerId);
  if (!container) return;
  container.innerHTML = items.map((item) => {
    const isRender = item.imageType !== "real";
    const recommendations = (item.recommendedFor || []).map((entry) => `<li>${escapeHtml(entry)}</li>`).join("");
    return `<article class="reference-card"><figure>${renderPicture(item, "image", `${item.name}${isRender ? " illustrative render" : ""}`)}${isRender ? '<figcaption>Illustrative render — not actual product.</figcaption>' : ""}</figure><div><p class="eyebrow">${kind}</p><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p>${recommendations ? `<ul>${recommendations}</ul>` : ""}</div></article>`;
  }).join("");
}

function renderResources() {
  const container = document.querySelector("#resourceGrid");
  if (!container) return;
  container.innerHTML = (resources.items || []).map((item) => `<article class="resource-card"><div class="resource-icon" aria-hidden="true">PDF</div><p class="eyebrow">${escapeHtml(item.category)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p>${item.file ? `<a class="button small" href="${escapeHtml(item.file)}" download>Download PDF</a>` : '<span class="availability-note">Available on request</span>'}</article>`).join("");
}

function renderApplications() {
  const container = document.querySelector("#applicationGrid");
  if (!container) return;
  container.innerHTML = (applications.items || []).map((item) => {
    const isRender = item.imageType !== "real";
    const colorHref = item.featuredColorSlug ? `colors.html?color=${encodeURIComponent(item.featuredColorSlug)}` : "colors.html#sample-kit";
    const caption = item.caption || "Application inspiration";
    return `<article class="application-card"><figure>${renderPicture(item, "image", item.imageAlt || `${item.title}${isRender ? " illustrative render" : ""}`)}${isRender ? `<figcaption>${escapeHtml(caption)} - illustrative scene, not a WHITEROCK project.</figcaption>` : ""}</figure><div><p class="eyebrow">${escapeHtml(item.category)} · ${escapeHtml(item.featuredColor)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><a class="text-link" href="${colorHref}">View the featured color →</a></div></article>`;
  }).join("");
}

document.querySelectorAll("[data-modal-close]").forEach((element) => element.addEventListener("click", () => closeModal(element.closest(".modal"))));

document.addEventListener("keydown", (event) => {
  const modal = document.querySelector(".modal.open");
  if (!modal) return;
  if (event.key === "Escape") {
    closeModal(modal);
    return;
  }
  if (event.key !== "Tab") return;
  const focusable = Array.from(modal.querySelectorAll('a[href]:not([hidden]), button:not([disabled]):not([hidden]), [tabindex]:not([tabindex="-1"])')).filter((element) => element.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

searchToggle?.addEventListener("click", () => {
  searchDrawer?.classList.toggle("open");
  searchToggle.setAttribute("aria-expanded", String(searchDrawer?.classList.contains("open")));
  if (searchDrawer?.classList.contains("open")) searchInput?.focus();
});
searchInput?.addEventListener("input", renderProducts);

function closeDesktopNav(except = null) {
  navTriggers.forEach((trigger) => {
    if (trigger === except) return;
    trigger.setAttribute("aria-expanded", "false");
    trigger.closest(".nav-group")?.classList.remove("open");
  });
}

navTriggers.forEach((trigger) => {
  const group = trigger.closest(".nav-group");
  const dropdown = group?.querySelector(".nav-dropdown");
  const links = Array.from(dropdown?.querySelectorAll("a") || []);
  trigger.addEventListener("click", () => {
    const willOpen = trigger.getAttribute("aria-expanded") !== "true";
    closeDesktopNav(trigger);
    trigger.setAttribute("aria-expanded", String(willOpen));
    group?.classList.toggle("open", willOpen);
  });
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      closeDesktopNav(trigger);
      trigger.setAttribute("aria-expanded", "true");
      group?.classList.add("open");
      links[0]?.focus();
    } else if (event.key === "Escape") {
      closeDesktopNav();
    }
  });
  dropdown?.addEventListener("keydown", (event) => {
    const index = links.indexOf(document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      closeDesktopNav();
      trigger.focus();
    } else if (event.key === "ArrowDown" && index >= 0) {
      event.preventDefault();
      links[(index + 1) % links.length]?.focus();
    } else if (event.key === "ArrowUp" && index >= 0) {
      event.preventDefault();
      links[(index - 1 + links.length) % links.length]?.focus();
    }
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-group")) closeDesktopNav();
});

document.addEventListener("focusin", (event) => {
  if (!event.target.closest(".desktop-nav")) closeDesktopNav();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !document.querySelector(".modal.open")) closeDesktopNav();
});

menuToggle?.addEventListener("click", () => {
  mobilePanel?.classList.toggle("open");
  const open = Boolean(mobilePanel?.classList.contains("open"));
  mobilePanel?.setAttribute("aria-hidden", String(!open));
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
mobilePanel?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  mobilePanel.classList.remove("open");
  mobilePanel.setAttribute("aria-hidden", "true");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open menu");
}));

function setFormNote(form, message, state = "") {
  const note = form.querySelector("[data-form-note], #formNote");
  if (!note) return;
  note.textContent = message;
  note.classList.remove("is-error", "is-success");
  if (state) note.classList.add(state);
}

const forms = [...new Set(document.querySelectorAll(".web3forms-form, #inquiryForm"))];
forms.forEach((form) => form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (form.id === "sampleKitForm" && !selectedColorSlugs.size) {
    setFormNote(form, "Select at least one color before submitting your sample request.", "is-error");
    document.querySelector("#colorGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (form.querySelector('[name="botcheck"]')?.checked) return;
  const accessKey = form.querySelector('[name="access_key"]')?.value || "";
  if (!accessKey || accessKey.toUpperCase().includes("WEB3FORMS_ACCESS_KEY")) {
    setFormNote(form, `Online submission is awaiting owner setup. Please email ${siteConfig.email || "lynn@whiterockstone.com"}.`, "is-error");
    return;
  }
  const submit = form.querySelector('button[type="submit"]');
  setFormNote(form, "Sending your inquiry…");
  if (submit) submit.disabled = true;
  try {
    const response = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
    const result = await response.json();
    if (!result.success) throw new Error("Submission rejected");
    form.reset();
    if (form.id === "sampleKitForm") { selectedColorSlugs.clear(); updateSampleKit(); }
    setFormNote(form, "Thank you. Your inquiry has been sent and we will reply by email shortly.", "is-success");
  } catch {
    setFormNote(form, `The form could not be sent. Please email ${siteConfig.email || "lynn@whiterockstone.com"} directly.`, "is-error");
  } finally {
    if (submit) submit.disabled = false;
  }
}));

(function initialize() {
  try {
    const stashed = sessionStorage.getItem("wr_inquiry");
    const form = document.querySelector("#inquiryForm");
    if (stashed && form) applyPrefill(form, JSON.parse(stashed));
    if (stashed) sessionStorage.removeItem("wr_inquiry");
  } catch {}
  initializeColorFilters();
  const params = new URLSearchParams(window.location.search);
  const requestedMaterial = params.get("material");
  if (requestedMaterial && colorMaterialFilter && Array.from(colorMaterialFilter.options).some((option) => option.value === requestedMaterial)) colorMaterialFilter.value = requestedMaterial;
  const requestedQuery = params.get("q");
  if (requestedQuery && searchInput) searchInput.value = requestedQuery;
  updateSampleKit();
  renderProducts();
  renderReferenceCards("#finishGrid", finishes, "Finish");
  renderReferenceCards("#edgeGrid", edges, "Edge profile");
  renderResources();
  renderApplications();
  const requestedColor = params.get("color");
  if (requestedColor && colors.some((color) => color.slug === requestedColor)) openColor(requestedColor);
})();

/* ===================== Inquiry List (multi-item RFQ cart) ===================== */
(function () {
  const KEY = "wr_inquiry_list";
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
  const write = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {} ; renderBadge(); };

  // Floating badge
  const fab = document.createElement("a");
  fab.className = "inquiry-fab";
  fab.href = "contact.html#inquiry";
  fab.setAttribute("aria-label", "View inquiry list");
  fab.innerHTML = '<span class="inquiry-fab-icon" aria-hidden="true">▤</span><span class="inquiry-fab-count" id="inquiryCount">0</span>';
  document.body.appendChild(fab);

  function renderBadge() {
    const n = read().length;
    fab.classList.toggle("show", n > 0);
    const c = fab.querySelector("#inquiryCount");
    if (c) c.textContent = String(n);
  }

  window.wrInquiry = {
    add(item) {
      const list = read();
      if (!list.some((x) => x.sku === item.sku)) list.push(item);
      write(list);
    },
    remove(sku) { write(read().filter((x) => x.sku !== sku)); },
    clear() { write([]); },
    items: read,
  };

  // "Add to inquiry" in product modal
  document.querySelector("#modalAddInquiry")?.addEventListener("click", (e) => {
    const title = activeProduct?.title || document.querySelector("#modalTitle")?.textContent || "";
    const sku = activeProduct?.sku || (title.match(/WR-[A-Z0-9-]+/) || [title])[0];
    window.wrInquiry.add({ sku, title });
    const button = e.currentTarget;
    button.textContent = "Added ✓";
    setTimeout(() => { button.textContent = "Add to inquiry list"; }, 1400);
  });

  // On contact page: show the list above the form + prefill message
  const form = document.querySelector("#inquiryForm");
  if (form) {
    const items = read();
    if (items.length) {
      const box = document.createElement("div");
      box.className = "inquiry-list-box";
      box.innerHTML = '<strong>Inquiry list</strong><ul>' +
        items.map((x) => `<li data-sku="${x.sku}">${x.title || x.sku} <button type="button" class="inq-remove" aria-label="Remove">×</button></li>`).join("") +
        '</ul>';
      form.parentNode.insertBefore(box, form);
      const ta = form.querySelector('textarea[name="message"]');
      if (ta && !ta.value.includes("Inquiry list:")) {
        ta.value = "Inquiry list:\n" + items.map((x) => `- ${x.sku} ${x.title && x.title !== x.sku ? "(" + x.title + ")" : ""}`).join("\n") + "\n\n" + ta.value;
      }
      box.addEventListener("click", (ev) => {
        const b = ev.target.closest(".inq-remove"); if (!b) return;
        const li = b.closest("li"); window.wrInquiry.remove(li.dataset.sku); li.remove();
        if (!box.querySelector("li")) box.remove();
      });
      form.addEventListener("submit", () => window.wrInquiry.clear(), { once: true });
    }
  }
  renderBadge();
})();

/* ===================== in/cm unit toggle inside product modal ===================== */
(function () {
  const btn = document.querySelector("#unitToggle");
  const specs = document.querySelector("#modalSpecs");
  if (!btn || !specs) return;
  const IN_RE = /(\d+(?:\.\d+)?)(\s*(?:x|×)\s*(\d+(?:\.\d+)?))?\s*in\b/g;
  let metric = false, original = null;
  function toCm(text) {
    return text.replace(IN_RE, (m, a, _x, b) => {
      const f = (v) => (Math.round(parseFloat(v) * 2.54 * 10) / 10).toString();
      return b ? `${f(a)} x ${f(b)} cm` : `${f(a)} cm`;
    });
  }
  btn.addEventListener("click", () => {
    if (original === null) original = specs.innerHTML;
    metric = !metric;
    specs.innerHTML = metric ? toCm(original) : original;
    btn.setAttribute("aria-pressed", String(metric));
    btn.classList.toggle("active", metric);
  });
  // reset when a new product opens (modal image src changes)
  const img = document.querySelector("#modalImage");
  if (img) new MutationObserver(() => { original = null; metric = false; btn.classList.remove("active"); btn.setAttribute("aria-pressed","false"); })
    .observe(img, { attributes: true, attributeFilter: ["src"] });
})();

/* ===================== back to top ===================== */
(function () {
  const b = document.createElement("button");
  b.type = "button"; b.className = "to-top"; b.setAttribute("aria-label", "Back to top");
  b.innerHTML = "↑";
  document.body.appendChild(b);
  const onScroll = () => b.classList.toggle("show", window.scrollY > 700);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  b.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

/* ===================== CN-style count-up stats (hero + factory bands) ===================== */
(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const targets = [];
  document.querySelectorAll(".hero-stats span > strong, [class*='stat'] strong").forEach((el) => {
    const m = (el.textContent || "").trim().match(/^(\d+)(\+|%)?$/);
    if (m) targets.push({ el, n: parseInt(m[1], 10), suffix: m[2] || "" });
  });
  if (!targets.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const t = targets.find((x) => x.el === entry.target);
      io.unobserve(entry.target);
      if (!t) return;
      const dur = 900, start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        t.el.textContent = Math.round(t.n * eased) + (p === 1 ? t.suffix : "");
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  targets.forEach((t) => io.observe(t.el));
})();

/* ===================== right-side quick-contact rail (CN stone-site style) ===================== */
(function () {
  const cfg = window.WR_SITE || {};
  const tel = (cfg.tel || "").replace(/[^+\d]/g, "");
  const wa = (cfg.whatsapp || "").replace(/[^\d]/g, "");
  const hasWa = wa.length >= 8;
  const rail = document.createElement("nav");
  rail.className = "contact-rail";
  rail.setAttribute("aria-label", "Quick contact");
  rail.innerHTML = [
    tel ? `<a href="tel:${tel}" title="Call ${cfg.tel}"><span class="cr-ico">✆</span><span class="cr-label">${cfg.tel}</span></a>` : "",
    hasWa ? `<a href="https://wa.me/${wa}" target="_blank" rel="noopener" title="WhatsApp"><span class="cr-ico">✆</span><span class="cr-label">WhatsApp</span></a>` : "",
    cfg.email ? `<a href="mailto:${cfg.email}" title="Email us"><span class="cr-ico">✉</span><span class="cr-label">${cfg.email}</span></a>` : "",
    `<a href="contact.html#inquiry" title="Request a quote"><span class="cr-ico">▤</span><span class="cr-label">Request a quote</span></a>`,
  ].filter(Boolean).join("");
  document.body.appendChild(rail);
})();

/* ===================== static locale dictionary for configured locales ===================== */
(function () {
  const dictionary = window.WR_I18N || {};
  if (!Object.keys(dictionary).length) return;

  function translate(value) {
    const text = String(value || "");
    const leading = text.match(/^\s*/)?.[0] || "";
    const trailing = text.match(/\s*$/)?.[0] || "";
    const core = text.trim();
    let next = dictionary[core];
    return next ? `${leading}${next}${trailing}` : text;
  }

  function translateTree(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      const next = translate(root.nodeValue);
      if (next !== root.nodeValue) root.nodeValue = next;
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE) {
      ["aria-label", "title", "placeholder", "alt"].forEach((name) => {
        if (!root.hasAttribute(name)) return;
        const current = root.getAttribute(name);
        const next = translate(current);
        if (next !== current) root.setAttribute(name, next);
      });
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) {
        const next = translate(node.nodeValue);
        if (next !== node.nodeValue) node.nodeValue = next;
      } else {
        ["aria-label", "title", "placeholder", "alt"].forEach((name) => {
          if (!node.hasAttribute(name)) return;
          const current = node.getAttribute(name);
          const next = translate(current);
          if (next !== current) node.setAttribute(name, next);
        });
      }
    }
  }

  translateTree(document.body);
  new MutationObserver((records) => records.forEach((record) => {
    if (record.type === "characterData") translateTree(record.target);
    record.addedNodes?.forEach(translateTree);
  })).observe(document.body, { childList: true, characterData: true, subtree: true });
})();

/* ===================== Compare drawer (products & colors, max 3) ===================== */
(function () {
  const MAX = 3;
  const picked = [];
  const productsArr = window.WR_PRODUCTS || [];
  const colorsArr = window.WR_COLORS || [];
  let compareReturnFocus = null;
  const find = (kind, id) => kind === "product"
    ? productsArr.find((x) => x.sku === id)
    : colorsArr.find((x) => x.slug === id);

  const drawer = document.createElement("div");
  drawer.className = "compare-drawer";
  drawer.setAttribute("aria-live", "polite");
  drawer.innerHTML = '<div class="compare-items"></div>' +
    '<div class="compare-actions"><button type="button" class="button primary" id="compareNow" disabled>Compare now</button>' +
    '<button type="button" class="button" id="compareClear">Clear</button></div>';
  document.body.appendChild(drawer);
  const itemsBox = drawer.querySelector(".compare-items");
  const nowBtn = drawer.querySelector("#compareNow");

  const modal = document.createElement("div");
  modal.className = "compare-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Comparison table");
  modal.hidden = true;
  modal.innerHTML = '<div class="compare-backdrop" data-cclose></div>' +
    '<div class="compare-card"><button type="button" class="icon-button compare-close" data-cclose aria-label="Close comparison">×</button><div class="compare-table-wrap"></div></div>';
  document.body.appendChild(modal);

  function refresh() {
    itemsBox.innerHTML = picked.map((p) => {
      const item = find(p.kind, p.id) || {};
      const label = item.name || item.sku || p.id;
      return `<button type="button" class="compare-chip" data-unpick="${p.kind}:${p.id}">${label} <span aria-hidden="true">×</span></button>`;
    }).join("");
    drawer.classList.toggle("show", picked.length > 0);
    nowBtn.disabled = picked.length < 2;
    document.querySelectorAll(".compare-toggle").forEach((b) => {
      const on = picked.some((p) => p.kind === b.dataset.compareKind && p.id === b.dataset.compareId);
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
      b.textContent = on ? "Added" : "Compare";
      const item = find(b.dataset.compareKind, b.dataset.compareId) || {};
      const label = item.title || item.name || item.sku || b.dataset.compareId;
      b.setAttribute("aria-label", on ? `Remove ${label} from comparison` : `Compare ${label}`);
    });
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest(".compare-toggle");
    if (t) {
      e.preventDefault(); e.stopPropagation();
      const kind = t.dataset.compareKind, id = t.dataset.compareId;
      if (picked.length && picked[0].kind !== kind) picked.length = 0;
      const idx = picked.findIndex((p) => p.kind === kind && p.id === id);
      if (idx >= 0) picked.splice(idx, 1);
      else if (picked.length < MAX) picked.push({ kind, id });
      refresh();
      return;
    }
    const chip = e.target.closest("[data-unpick]");
    if (chip) {
      const [kind, id] = chip.dataset.unpick.split(":");
      const idx = picked.findIndex((p) => p.kind === kind && p.id === id);
      if (idx >= 0) picked.splice(idx, 1);
      refresh();
    }
  }, true);

  drawer.querySelector("#compareClear").addEventListener("click", () => { picked.length = 0; refresh(); });

  function rowsFor(kind, items) {
    if (kind === "product") {
      const keys = [];
      items.forEach((it) => Object.keys(it.specs || {}).forEach((k) => { if (!keys.includes(k)) keys.push(k); }));
      const head = ["Material", ...keys];
      return head.map((k) => [k, ...items.map((it) => k === "Material" ? (it.material || "—") : ((it.specs || {})[k] || "—"))]);
    }
    return [
      ["Material", ...items.map((c) => c.material || "—")],
      ["Color family", ...items.map((c) => c.colorFamily || "—")],
      ["Finishes", ...items.map((c) => (c.finishes || []).join(" / ") || "—")],
      ["Thickness", ...items.map((c) => (c.thicknesses || []).join(" / ") || "—")],
    ];
  }

  nowBtn.addEventListener("click", () => {
    if (picked.length < 2) return;
    const kind = picked[0].kind;
    const items = picked.map((p) => find(p.kind, p.id)).filter(Boolean);
    const imgKey = kind === "product" ? "imageWebp" : "swatchImageWebp";
    const imgAlt = kind === "product" ? "image" : "swatchImage";
    const header = '<tr><th scope="col"></th>' + items.map((it) =>
      `<th scope="col"><img src="${(it[imgKey] || it[imgAlt]) || ""}" alt="" loading="lazy" /><div>${it.name || it.sku}</div>${kind === "product" && it.imageType !== "real" ? '<small>Illustrative render</small>' : ""}</th>`).join("") + '</tr>';
    const body = rowsFor(kind, items).map((r) =>
      '<tr>' + r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join("") + '</tr>').join("");
    modal.querySelector(".compare-table-wrap").innerHTML =
      `<table class="compare-matrix"><caption class="sr-only">Comparison table</caption>${header}${body}</table>`;
    compareReturnFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".compare-close").focus();
  });

  function closeComparison() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (compareReturnFocus && document.contains(compareReturnFocus)) compareReturnFocus.focus();
  }

  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-cclose]")) closeComparison();
  });
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") closeComparison();
    if (e.key === "Tab") {
      const focusable = [...modal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();

/* ===================== Lightbox for gallery/lookbook images ===================== */
(function () {
  const SEL = ".factory-gallery img, .lookbook-cms-grid img";
  const imgs = Array.from(document.querySelectorAll(SEL)).filter((im) => !im.closest("a"));
  if (!imgs.length) return;
  const t = (source) => window.WR_I18N?.[source] || source;
  const box = document.createElement("div");
  box.className = "lightbox"; box.hidden = true;
  box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", t("Image viewer"));
  box.innerHTML = '<div class="lb-backdrop" data-lb-close></div>' +
    '<figure class="lb-figure"><img alt="" /><figcaption><span class="lb-caption"></span><span class="lb-counter" aria-live="polite"></span></figcaption></figure>' +
    `<button type="button" class="lb-btn lb-close" data-lb-close aria-label="${t("Close image viewer")}">×</button>` +
    `<button type="button" class="lb-btn lb-prev" aria-label="${t("Previous image")}">‹</button>` +
    `<button type="button" class="lb-btn lb-next" aria-label="${t("Next image")}">›</button>`;
  document.body.appendChild(box);
  const big = box.querySelector("img"), cap = box.querySelector(".lb-caption"), counter = box.querySelector(".lb-counter");
  let cur = 0, lastFocus = null;
  const captionFor = (im) => {
    const figure = im.closest("figure");
    return figure?.querySelector("figcaption strong")?.textContent?.trim()
      || figure?.querySelector("figcaption")?.textContent?.trim()
      || im.alt
      || t("Image");
  };
  function show(i) {
    cur = (i + imgs.length) % imgs.length;
    const src = imgs[cur].currentSrc || imgs[cur].src;
    big.src = src; big.alt = imgs[cur].alt || "";
    cap.textContent = captionFor(imgs[cur]);
    counter.textContent = `${cur + 1} / ${imgs.length}`;
    counter.setAttribute("aria-label", `${t("Image")} ${cur + 1} / ${imgs.length}`);
  }
  function open(i) { lastFocus = document.activeElement; show(i); box.hidden = false; document.body.style.overflow = "hidden"; box.querySelector(".lb-close").focus(); }
  function close() { if (box.hidden) return; box.hidden = true; document.body.style.overflow = ""; if (lastFocus?.focus) lastFocus.focus(); }
  imgs.forEach((im, i) => {
    im.classList.add("lb-zoomable");
    im.setAttribute("tabindex", "0"); im.setAttribute("role", "button");
    im.setAttribute("aria-haspopup", "dialog");
    im.setAttribute("aria-label", `${t("Open image")}: ${captionFor(im)}`);
    im.addEventListener("click", () => open(i));
    im.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); } });
  });
  box.addEventListener("click", (e) => {
    if (e.target.closest("[data-lb-close]")) close();
    else if (e.target.closest(".lb-prev")) show(cur - 1);
    else if (e.target.closest(".lb-next")) show(cur + 1);
  });
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
    if (e.key === "Tab") {
      const controls = Array.from(box.querySelectorAll("button:not([disabled])"));
      const first = controls[0], last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();

/* print-support: mirror product modal open state onto <body> */
(function(){
  const modal=document.querySelector("#productModal"); if(!modal) return;
  new MutationObserver(()=>{document.body.classList.toggle("modal-open", modal.classList.contains("open"));})
    .observe(modal,{attributes:true,attributeFilter:["class"]});
})();
