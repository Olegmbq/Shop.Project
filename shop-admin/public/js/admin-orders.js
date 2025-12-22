async function loadOrders() {
  const res = await fetch("http://localhost:4000/api/orders");
  const orders = await res.json();

  const app = document.getElementById("app");
  app.innerHTML = `
    <h1>📦 Заказы</h1>

    <div class="orders-list">
      ${orders
        .map(
          (o) => `
        <div class="order-card">
          <h3>Заказ #${o.id}</h3>
          <p><b>Имя:</b> ${o.customer_name}</p>
          <p><b>Телефон:</b> ${o.customer_phone}</p>
          <p><b>Сумма:</b> ${o.total_price} $</p>
          <p><b>Статус:</b> <span class="status">${o.status}</span></p>

          <h4>Товары:</h4>
          <ul>
            ${o.items
              .map(
                (i) => `<li>${i.title} — ${i.quantity} шт. (${i.price}$)</li>`
              )
              .join("")}
          </ul>

          <button class="change-status" data-id="${
            o.id
          }">Изменить статус</button>
          <button class="delete-order" data-id="${o.id}">Удалить</button>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  bindButtons();
}

function bindButtons() {
  document.querySelectorAll(".delete-order").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.dataset.id;

      if (!confirm("Удалить заказ?")) return;

      await fetch(`http://localhost:4000/api/orders/${id}`, {
        method: "DELETE",
      });

      loadOrders();
    };
  });

  document.querySelectorAll(".change-status").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.dataset.id;

      const newStatus = prompt(
        "Введите статус: new / processing / shipped / completed"
      );

      if (!newStatus) return;

      await fetch(`http://localhost:4000/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      loadOrders();
    };
  });
}

loadOrders();
