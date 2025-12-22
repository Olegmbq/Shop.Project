// === CART CORE ===
import {
  getCart,
  saveCart,
  removeFromCart,
  clearCart,
  updateCartCount,
} from "./cart-core.js";

const cartList = document.getElementById("cart-list");
const totalBlock = document.getElementById("cart-total");
const clearBtn = document.querySelector(".clear-cart");
const checkoutBtn = document.querySelector(".checkout-btn");

// Первый рендер корзины
renderCart();
updateCartCount();

/* ----------------------------------------------------
      БЕЗОПАСНЫЙ ПАРСИНГ ЦЕНЫ
---------------------------------------------------- */
function parsePrice(price) {
  const cleaned = parseFloat(
    String(price)
      .replace(",", ".")
      .replace(/[^\d.]/g, "")
  );
  return Number.isNaN(cleaned) ? 0 : cleaned;
}

/* ----------------------------------------------------
      ОТРИСОВКА КОРЗИНЫ
---------------------------------------------------- */
function renderCart() {
  const cart = getCart();

  if (cart.length === 0) {
    cartList.innerHTML = `<h2 class="empty-cart">Корзина пуста 💜</h2>`;
    totalBlock.textContent = "0.00";
    return;
  }

  cartList.innerHTML = "";
  let sum = 0;

  cart.forEach((item, index) => {
    const price = parsePrice(item.price);
    const qty = item.qty || 1;
    const itemTotal = price * qty;
    sum += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.image}" class="cart-img"/>

      <div class="cart-info">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>

        <strong>${price.toFixed(2)} $ × ${qty} = ${itemTotal.toFixed(
      2
    )} $</strong>

        <div class="qty-controls">
          <button class="qty-minus">−</button>
          <span class="qty-display">${qty}</span>
          <button class="qty-plus">+</button>
        </div>
      </div>

      <button class="remove-btn">Удалить</button>
    `;

    /* --------------------------------------------
            ОБРАБОТЧИКИ КНОПОК
    -------------------------------------------- */

    // Удалить товар
    div.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromCart(index);
      renderCart();
      updateCartCount();
    });

    // Уменьшить qty
    div.querySelector(".qty-minus").addEventListener("click", () => {
      const cart = getCart();
      if (cart[index].qty > 1) {
        cart[index].qty--;
      }
      saveCart(cart);
      renderCart();
      updateCartCount();
    });

    // Увеличить qty
    div.querySelector(".qty-plus").addEventListener("click", () => {
      const cart = getCart();
      cart[index].qty = (cart[index].qty || 1) + 1;
      saveCart(cart);
      renderCart();
      updateCartCount();
    });

    cartList.appendChild(div);
  });

  totalBlock.textContent = sum.toFixed(2);
}

/* ----------------------------------------------------
      ОЧИСТКА КОРЗИНЫ
---------------------------------------------------- */
clearBtn.onclick = () => {
  clearCart();
  renderCart();
  updateCartCount();
};

/* ----------------------------------------------------
      ПЕРЕХОД НА ОФОРМЛЕНИЕ
---------------------------------------------------- */
checkoutBtn.onclick = () => {
  const modal = document.getElementById("cart-modal");
  const modalText = document.getElementById("cart-modal-text");

  const total = totalBlock.textContent;

  modalText.textContent = `Родной, переходим к оформлению заказа. Итог: ${total} $.`;

  modal.classList.remove("hide");
  modal.classList.add("show");

  document.getElementById("cart-modal-close").onclick = () => {
    modal.classList.add("hide");
    window.location.href = "checkout.html";
  };
};

/* ----------------------------------------------------
      ДЛЯ ВНЕШНЕГО ВЫЗОВА
---------------------------------------------------- */
export function showCartModal(text) {
  const modal = document.getElementById("cart-modal");
  const msg = document.getElementById("cart-modal-text");

  msg.textContent = text;

  modal.classList.remove("hide");
  modal.classList.add("show");

  document.getElementById("cart-modal-close").onclick = () => {
    modal.classList.add("hide");
    window.location.href = "catalog.html";
  };
}
