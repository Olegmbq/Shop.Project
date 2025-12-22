<p align="center">
  🌍 <strong>Languages:</strong><br><br>

  <a href="./README.md">
    <img src="https://img.shields.io/badge/Language-RU-blue?style=for-the-badge" />
  </a>

  <a href="./README_EN.md">
    <img src="https://img.shields.io/badge/Language-EN-red?style=for-the-badge" />
  </a>
</p>

<br>
<hr>
<br>

<div align="center">
  <img
    src="./assets/oleg-neuro-logo.png"
    alt="Shop.Project Logo"
    width="320"
    style="border-radius:26px; box-shadow:0 0 28px rgba(168,85,247,0.85); margin-bottom:24px;"
  />
</div>

<br>
<hr>
<br>

<div align="center">
  <!-- Frontend -->
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-TS-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />

<br><br>

  <!-- Backend -->
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white" />

<br><br>

  <!-- Database -->
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />

<br><br>

  <!-- Tools -->
  <img src="https://img.shields.io/badge/Dotenv-ENV-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black" />
  <img src="https://img.shields.io/badge/Multer-Uploads-FF6F00?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Concurrently-Dev-4B0082?style=for-the-badge" />

<br><br>

  <!-- Dev tools -->
  <img src="https://img.shields.io/badge/MySQL_Workbench-DB_Tool-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</div>

<br>

<br>
<hr>
<br>

<h1 align="center">🛒 Shop.Project — Fullstack Online Store</h1>

<p align="center">
A complete <b>fullstack e-commerce project</b> with a client storefront,
admin panel and backend API.<br>
Implements a real-world e-commerce flow:<br>
<b>catalog → cart → checkout → database storage</b>
</p>

<br>
<hr>
<br>

<h2>🚀 Project Features</h2>

<h3>🛍 Client (shop-client)</h3>
<ul>
  <li>Product catalog with categories</li>
  <li>Product details page</li>
  <li>Add to cart</li>
  <li>Quantity control (− / +)</li>
  <li>Real-time price calculation</li>
  <li>Cart persistence via localStorage</li>
  <li>Checkout page</li>
  <li>Thank You page after order</li>
</ul>

<br>
<hr>
<br>

<h3>🧾 Checkout</h3>
<ul>
  <li>Customer name and phone</li>
  <li>Order comment</li>
  <li>Product list with quantities</li>
  <li>Total price calculation</li>
  <li>Order submission to API</li>
  <li>Order ID generation</li>
</ul>

<br>
<hr>
<br>

<h3>🧑‍💼 Admin Panel (shop-admin)</h3>
<ul>
  <li>Admin authentication</li>
  <li>Add / edit / delete products</li>
  <li>Image uploads</li>
  <li>Product categories</li>
  <li>Multiple images per product</li>
</ul>

<br>
<hr>
<br>

<h3>⚙ Backend / API (shop-api)</h3>
<ul>
  <li>REST API built with Express</li>
  <li>MySQL database integration</li>
  <li>Product CRUD operations</li>
  <li>Order creation</li>
  <li>Order ID generation</li>
  <li>Order statuses</li>
</ul>

<br>
<hr>
<br>

<h2>📸 Screenshots</h2>

<p align="center">
  <!-- Catalog -->
  <img src="./screenshots/01-catalog.png" width="900" alt="Product catalog" />
  <br><br>

  <!-- Cart -->
  <img src="./screenshots/02-cart.png" width="900" alt="Shopping cart with quantity controls" />
  <br><br>

  <!-- Checkout -->
  <img src="./screenshots/03-checkout.png" width="900" alt="Checkout page" />
  <br><br>

  <!-- Admin list -->
  <img src="./screenshots/05-admin-list.png" width="900" alt="Admin panel product list" />
  <br><br>

  <!-- Admin edit -->
  <img src="./screenshots/06-admin-edit.png" width="900" alt="Admin edit product page" />
</p>

<h2>🗄 Database (MySQL)</h2>

<ul>
  <li>id (AUTO_INCREMENT)</li>
  <li>customer_name</li>
  <li>customer_phone</li>
  <li>comment</li>
  <li>total_price</li>
  <li>status</li>
  <li>created_at</li>
  <li>items (JSON)</li>
</ul>

<br>
<hr>
<br>

<h2>🧱 Project Structure</h2>

<pre>
Shop.Project/
├── shop-client/
├── shop-admin/
├── shop-api/
├── shop-server/
├── uploads/
├── assets/
└── README.md
</pre>

<br>
<hr>
<br>

<h2>🧰 Technologies</h2>

<ul>
  <li>Frontend: React, TypeScript, Vite</li>
  <li>Backend: Node.js, Express</li>
  <li>Database: MySQL</li>
  <li>State: localStorage</li>
  <li>Tools: dotenv, multer, concurrently</li>
</ul>

<br>
<hr>
<br>

<h2>▶ Run Locally</h2>

<pre>
npm install
npm run dev
</pre>

<ul>
  <li>Client: http://localhost:5173</li>
  <li>Admin: http://localhost:5174</li>
  <li>API: http://localhost:3000</li>
  <li>Server: http://localhost:4000</li>
</ul>

<br>
<hr>
<br>

<h2>📌 Project Status</h2>

<p>
🟢 Stable and fully functional
</p>

<ul>
  <li>Order items persistence</li>
  <li>User authentication</li>
  <li>Order history</li>
  <li>Deployment & CI/CD</li>
</ul>

<br>
<hr>
<br>

<h2>👤 Author</h2>

<p>
<b>Oleg Martyanov & Neuro</b><br>
Fullstack Developer
</p>

<br>
<hr>
<br>

<div align="center">
  <img
    src="./assets/oleg-neuro-logo.png"
    alt="Oleg & Neuro Code Studio"
    width="120"
    style="border-radius:16px; box-shadow:0 0 16px rgba(168,85,247,0.6); margin-top:40px;"
  />
  <p style="color:#a855f7; font-size:14px; margin-top:10px;">
    Created by <b>Oleg & Neuro Code Studio</b> 💜<br>
    Logic • Code • Neon
  </p>
</div>
