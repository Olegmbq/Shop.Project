//------------------------------------------------------
//   КАТЕГОРИИ
//------------------------------------------------------
const categories = [
  { id: "phones", name: "Телефоны", icon: "📱" },
  { id: "laptops", name: "Ноутбуки", icon: "💻" },
  { id: "audio", name: "Аудио", icon: "🎧" },
  { id: "watches", name: "Часы", icon: "⌚" },
  { id: "consoles", name: "Приставки", icon: "🎮" },
];

//------------------------------------------------------
//   РЕНДЕР КНОПОК КАТЕГОРИЙ
//------------------------------------------------------
function renderCategoryButtons(activeCategory = "phones") {
  const panel = document.getElementById("category-panel");
  panel.innerHTML = "";

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    if (cat.id === activeCategory) btn.classList.add("active");

    btn.innerHTML = `${cat.icon} ${cat.name}`;
    btn.onclick = () => loadProducts(cat.id);

    panel.appendChild(btn);
  });
}

//------------------------------------------------------
//   ЗАГРУЗКА ТОВАРОВ
//------------------------------------------------------
let filtered = []; // ВАЖНО — глобальная переменная для кнопок корзины

async function loadProducts(category) {
  const response = await fetch("http://localhost:4000/api/products");
  const products = await response.json();

  filtered = category
    ? products.filter((p) => p.category === category)
    : products;

  renderCategoryButtons(category);

  const container = document.getElementById("catalog");
  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty">Нет товаров в этой категории 💔</div>`;
    return;
  }

  // Рендер карточек
  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${p.image_url}" alt="${p.title}">
      <div class="product-title">${p.title}</div>
      <div class="product-price">${p.price} $</div>
      <div class="product-desc">${p.description}</div>

      <button class="add-to-cart neon-btn" data-id="${p.id}">
        🛒 В корзину
      </button>
    `;

    container.appendChild(card);
  });

  //------------------------------------------
  //     навешиваем кнопки ДОБАВЛЕНИЯ
  //------------------------------------------
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;

      const product = filtered.find((p) => p.id == id);

      let cart = JSON.parse(localStorage.getItem("cart") || "[]");

      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        desc: product.description,
        image: product.image_url,
      });

      localStorage.setItem("cart", JSON.stringify(cart));

      updateCartCount();
    });
  });
}

//------------------------------------------------------
//   СЧЁТЧИК КОРЗИНЫ
//------------------------------------------------------
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  document.getElementById("cart-count").textContent = cart.length;
}

//------------------------------------------------------
//   СТАРТОВЫЙ ЗАПУСК
//------------------------------------------------------
renderCategoryButtons("phones");
loadProducts("phones");
updateCartCount();
