/* =====================================================
      NEON ADMIN — Полный финальный admin.js
===================================================== */

// 📌 Правильный API адрес для работы с товарами
const API_URL = "http://localhost:3000/products";

let sortSelect;
let products = [];
let filtered = [];
let currentPage = 1;
const PER_PAGE = 6;

// DOM-элементы
let loader,
  searchInput,
  categorySelect,
  productsGrid,
  paginationBlock,
  itemsCount,
  themeToggle,
  logoutBtn;

/* =====================================================
      ЗАГРУЗКА СТРАНИЦЫ
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // Проверка авторизации

  // 🔐 Защита админки
  if (localStorage.getItem("adminAuth") !== "true") {
    localStorage.removeItem("adminAuth"); // на всякий случай
    window.location.href = "admin-login.html";
    return;
  }

  sortSelect = document.getElementById("sort-select");

  sortSelect?.addEventListener("change", () => {
    applyFilters();
  });

  // Получаем элементы
  loader = document.getElementById("admin-loader");
  searchInput = document.getElementById("search-input");
  categorySelect = document.getElementById("category-filter");
  productsGrid = document.getElementById("products-grid");
  paginationBlock = document.getElementById("pagination");
  itemsCount = document.getElementById("items-count");
  themeToggle = document.getElementById("theme-toggle");
  logoutBtn = document.getElementById("logout-btn");

  // 🔙 Кнопка "На сайт"
  const backToShopBtn = document.getElementById("back-to-shop");

  backToShopBtn?.addEventListener("click", () => {
    console.log("↩ Переход на сайт из админки");

    localStorage.removeItem("adminAuth"); // очистка авторизации

    setTimeout(() => {
      window.location.href = "http://localhost:5173/";
    }, 100);
  });

  // События поиска и фильтра
  searchInput?.addEventListener("input", () => {
    currentPage = 1;
    applyFilters();
  });

  categorySelect?.addEventListener("change", () => {
    currentPage = 1;
    applyFilters();
  });

  // Тема
  themeToggle?.addEventListener("click", toggleTheme);
  initTheme();

  // Выход
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("adminAuth");
    window.location.href = "admin-login.html";
  });

  // Инициализируем модалку удаления
  initDeleteModal();

  // Загружаем товары
  loadProducts();
});

/* =====================================================
      ЛОАДЕР
===================================================== */
function showLoader(show) {
  if (!loader) return;
  loader.classList.toggle("hidden", !show);
}

/* =====================================================
      ЗАГРУЗКА ТОВАРОВ
===================================================== */
async function loadProducts() {
  try {
    showLoader(true);
    const res = await fetch(API_URL);
    const data = await res.json();

    products = Array.isArray(data) ? data : [];
    filtered = [...products];

    currentPage = 1;
    render();
  } catch (err) {
    console.error("Ошибка загрузки:", err);
    if (productsGrid) {
      productsGrid.innerHTML =
        '<div class="admin-error-box">Ошибка загрузки товаров 💔</div>';
    }
  } finally {
    showLoader(false);
  }
}

/* =====================================================
      ПОИСК + ФИЛЬТР
===================================================== */
function applyFilters() {
  const text = (searchInput?.value || "").toLowerCase().trim();
  const cat = categorySelect?.value || "all";

  const min = parseFloat(document.getElementById("price-min")?.value) || 0;
  const max =
    parseFloat(document.getElementById("price-max")?.value) || Infinity;

  filtered = products.filter((p) => {
    const price = safePrice(p.price);
    const byCat = cat === "all" || p.category === cat;

    const title = (p.title || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    const byText = !text || title.includes(text) || desc.includes(text);

    const byPrice = price >= min && price <= max;

    return byCat && byText && byPrice;
  });

  applySort();
  render();
}

/* =====================================================
      ОСНОВНОЙ РЕНДЕР
===================================================== */
function render() {
  if (!productsGrid) return;
  renderProducts();
  renderPagination();
  renderCount();
}

/* =====================================================
      РЕНДЕР КАРТОЧЕК
===================================================== */
function renderProducts() {
  productsGrid.innerHTML = "";

  if (!filtered.length) {
    productsGrid.innerHTML = '<div class="admin-empty">Нет товаров 💜</div>';
    return;
  }

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * PER_PAGE;
  const pageItems = filtered.slice(start, start + PER_PAGE);

  pageItems.forEach((p) => {
    const card = document.createElement("div");
    card.className = "admin-card";

    const price = safePrice(p.price);

    card.innerHTML = `
  <div class="admin-card-image">
    <img src="http://localhost:4000${p.image_url}" alt="${p.title}">
  </div>

  <div class="admin-card-body">
    <div class="admin-card-title-row">
      <h3>${p.title}</h3>
      <span class="admin-tag">${p.category || "без категории"}</span>
    </div>

    <p class="admin-card-desc">${p.description || ""}</p>

    <div class="admin-card-footer">
      <span class="admin-price">${price.toFixed(2)} $</span>

      <div class="admin-actions">
        <button class="admin-btn small ghost edit-btn" data-id="${p.id}">
          ✏️ Редактировать
        </button>

        <button class="admin-btn small danger delete-btn" data-id="${p.id}">
          🗑 Удалить
        </button>
      </div>
    </div>
  </div>
`;

    // EDIT
    const editBtn = card.querySelector(".edit-btn");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        window.location.href = `admin-edit-product.html?id=${p.id}`;
      });
    }

    // DELETE — открываем неоновую модалку
    const deleteBtn = card.querySelector(".delete-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        console.log("🗑 Кнопка DELETE нажата для id =", p.id);
        openDeleteModal(p.id, p.title);
      });
    }

    productsGrid.appendChild(card);
  });
}

/* =====================================================
      НЕОНОВАЯ МОДАЛКА УДАЛЕНИЯ
===================================================== */
let deleteModal, deleteConfirm, deleteCancel, deleteTitle;
let deleteId = null;

function initDeleteModal() {
  deleteModal = document.getElementById("delete-modal");
  deleteConfirm = document.getElementById("delete-confirm");
  deleteCancel = document.getElementById("delete-cancel");
  deleteTitle = document.getElementById("delete-item-title");

  if (!deleteModal || !deleteConfirm || !deleteCancel || !deleteTitle) {
    console.warn("❗ Модалка удаления не найдена в HTML");
    return;
  }

  // Кнопка "Отмена" — просто закрываем модалку
  deleteCancel.addEventListener("click", closeDeleteModal);

  // Кнопка "Да, удалить"

  deleteConfirm.addEventListener("click", async () => {
    if (!deleteId) return;

    try {
      console.log("🔥 Удаляем товар id =", deleteId);

      const res = await fetch(`${API_URL}/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Ошибка удаления:", res.status, text);
        alert("Не удалось удалить товар (ошибка сервера)");
        return;
      }

      // Убираем товар из массива, чтобы сразу обновился список
      products = products.filter((p) => Number(p.id) !== Number(deleteId));
      applyFilters(); // перерендер
    } catch (err) {
      console.error("🔥 Ошибка сети при удалении:", err);
      alert("Ошибка сети при удалении товара");
    } finally {
      closeDeleteModal();
    }
  });
}

// Открыть модалку
function openDeleteModal(id, title) {
  if (!deleteModal || !deleteTitle) return;
  deleteId = id;
  deleteTitle.textContent = `Удаляем: ${title}?`;
  deleteModal.classList.add("show"); // или убираем класс hidden, если он у тебя
}

// Закрыть модалку
function closeDeleteModal() {
  if (!deleteModal) return;
  deleteModal.classList.remove("show"); // или добавляем hidden
  deleteId = null;
}

/* =====================================================
      ПАГИНАЦИЯ
===================================================== */
function renderPagination() {
  if (!paginationBlock) return;

  paginationBlock.innerHTML = "";

  if (!filtered.length) return;

  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "page-btn";
    if (i === currentPage) btn.classList.add("active");
    btn.textContent = i;

    btn.addEventListener("click", () => {
      currentPage = i;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    paginationBlock.appendChild(btn);
  }
}

/* =====================================================
      СЧЁТЧИК
===================================================== */
function renderCount() {
  if (!itemsCount) return;
  const count = filtered.length;
  itemsCount.textContent = `${count} товар${plural(count)}`;
}

function plural(n) {
  if (n % 10 === 1 && n % 100 !== 11) return "";
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return "а";
  return "ов";
}

/* =====================================================
      ТЕМЫ
===================================================== */
function initTheme() {
  const saved = localStorage.getItem("adminTheme") || "dark";
  setTheme(saved);
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("adminTheme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "🌙 Dark" : "☀️ Light";
  }
}

function toggleTheme() {
  const current = document.body.dataset.theme || "dark";
  const next = current === "dark" ? "light" : "dark";
  setTheme(next);
}

/* =====================================================
      ПАРСИНГ ЦЕНЫ
===================================================== */
function safePrice(price) {
  const parsed = parseFloat(
    String(price)
      .replace(",", ".")
      .replace(/[^\d.]/g, "")
  );
  return Number.isNaN(parsed) ? 0 : parsed;
}
const priceMin = document.getElementById("price-min");
const priceMax = document.getElementById("price-max");

priceMin?.addEventListener("input", () => {
  currentPage = 1;
  applyFilters();
});
priceMax?.addEventListener("input", () => {
  currentPage = 1;
  applyFilters();
});
/* =====================================================
      СОРТИРОВКА
===================================================== */
function applySort() {
  const mode = sortSelect?.value || "none";

  switch (mode) {
    case "price-asc":
      filtered.sort((a, b) => safePrice(a.price) - safePrice(b.price));
      break;

    case "price-desc":
      filtered.sort((a, b) => safePrice(b.price) - safePrice(a.price));
      break;

    case "title-asc":
      filtered.sort((a, b) =>
        a.title.localeCompare(b.title, "ru", { sensitivity: "base" })
      );
      break;

    case "title-desc":
      filtered.sort((a, b) =>
        b.title.localeCompare(a.title, "ru", { sensitivity: "base" })
      );
      break;

    case "date-desc":
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;

    case "date-asc":
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      break;

    case "none":
    default:
      // ничего не делаем
      break;
  }
}
//document.getElementById("nav-orders").addEventListener("click", () => {
//window.location.href = "/admin-orders.html";
//});
