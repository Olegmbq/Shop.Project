/* ---------------------------------------------------
      CART CORE — единая стабильная логика
--------------------------------------------------- */

// 🔹 Получить корзину
export function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

// 🔹 Сохранить корзину
export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// 🔹 Единый парсинг цены
export function parsePrice(value) {
  return (
    parseFloat(
      String(value)
        .replace(",", ".")
        .replace(/[^\d.]/g, "")
    ) || 0
  );
}

// 🔹 Добавление товара

export function addToCart(product) {
  let cart = getCart();

  // если товар уже есть — увеличиваем qty
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      desc: product.desc || product.description,
      image: product.image || product.image_url,
      qty: 1, // <<< обязательно ставим !!!
    });
  }

  saveCart(cart);
  updateCartCount();
}

// 🔹 Уменьшение qty
export function decreaseQty(id) {
  const cart = getCart();

  const item = cart.find((p) => p.id === id);
  if (!item) return;

  if (item.qty > 1) {
    item.qty--;
  } else {
    const index = cart.indexOf(item);
    cart.splice(index, 1);
  }

  saveCart(cart);
}

// 🔹 Удаление по индексу
export function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

// 🔹 Полная очистка корзины
export function clearCart() {
  localStorage.setItem("cart", "[]");
}

// 🔹 Счётчик товаров в шапке
export function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + (i.qty || 1), 0);
  const elem = document.getElementById("cart-count");
  if (elem) elem.textContent = total;
}
