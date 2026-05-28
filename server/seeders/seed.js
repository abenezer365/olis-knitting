/**
 * Development seeder — populates the database with realistic demo data.
 *
 *   npm run seed                         (local)
 *   docker compose exec api npm run seed (docker)
 *
 * Refuses to run when NODE_ENV=production so it can never wipe real data.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import env from "../config/env.js";

if (env.isProd) {
  console.error("⛔ Refusing to seed: NODE_ENV is 'production'.");
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const IMG = {
  wrap: { main: "/upload/products/wrap/main.jpeg", sub: ["/upload/products/wrap/sub-1.jpeg"] },
  yorabe: { main: "/upload/products/yorabe/main.png", sub: ["/upload/products/yorabe/sub-1.png"] },
};

const j = (v) => JSON.stringify(v);

async function run() {
  const conn = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
    multipleStatements: true,
  });

  console.log(`🌱 Seeding "${env.db.database}" on ${env.db.host}:${env.db.port} ...`);

  // 1) Ensure tables exist (idempotent schema).
  const schema = fs.readFileSync(path.join(__dirname, "../schema/table.sql"), "utf8");
  await conn.query(schema);

  // 2) Reset all tables.
  const tables = [
    "ordered_items",
    "shipping_addresses",
    "orders",
    "products",
    "categories",
    "customers",
    "shipping_fee",
    "messages",
    "currency_rates",
    "revenue",
    "analytics",
    "users",
  ];
  await conn.query("SET FOREIGN_KEY_CHECKS = 0");
  for (const t of tables) await conn.query(`TRUNCATE TABLE ${t}`);
  await conn.query("SET FOREIGN_KEY_CHECKS = 1");

  // 3) Users (initial admin + staff).
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@olisknitwear.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const staffHash = await bcrypt.hash("Staff@12345", 10);
  await conn.query(
    `INSERT INTO users (uuid, first_name, last_name, email, password_hash, phone, role, status) VALUES ?`,
    [
      [
        [uuidv4(), "Oli", "Admin", adminEmail, adminHash, "+251911000000", "admin", "active"],
        [uuidv4(), "Marta", "Manager", "manager@olisknitwear.com", staffHash, "+251911000001", "manager", "active"],
        [uuidv4(), "Sami", "Staff", "employee@olisknitwear.com", staffHash, "+251911000002", "employee", "active"],
      ],
    ]
  );

  // 4) Categories.
  const categoryNames = ["Sweaters", "Scarves", "Hats", "Blankets", "Accessories"];
  const catId = {};
  for (const name of categoryNames) {
    const [res] = await conn.query("INSERT INTO categories (uuid, name) VALUES (?, ?)", [uuidv4(), name]);
    catId[name] = res.insertId;
  }

  // 5) Products.
  const products = [
    ["Highland Wool Sweater", "Sweaters", 89.99, 4.8, IMG.wrap, ["Cream", "Charcoal", "Forest"], ["S", "M", "L", "XL"]],
    ["Cable Knit Pullover", "Sweaters", 74.5, 4.6, IMG.yorabe, ["Oatmeal", "Navy"], ["S", "M", "L"]],
    ["Merino Crewneck", "Sweaters", 95.0, 4.9, IMG.wrap, ["Burgundy", "Black"], ["M", "L", "XL"]],
    ["Hand-Spun Scarf", "Scarves", 32.0, 4.7, IMG.yorabe, ["Mustard", "Rust", "Teal"], ["One Size"]],
    ["Chunky Infinity Scarf", "Scarves", 28.5, 4.4, IMG.wrap, ["Grey", "Blush"], ["One Size"]],
    ["Beanie Hat", "Hats", 22.0, 4.5, IMG.yorabe, ["Black", "Cream", "Olive"], ["One Size"]],
    ["Wool Throw Blanket", "Blankets", 120.0, 5.0, IMG.wrap, ["Natural", "Slate"], ["120x150cm"]],
    ["Knitted Mittens", "Accessories", 18.0, 4.3, IMG.yorabe, ["Red", "Grey"], ["S", "M"]],
  ];
  const productIds = [];
  for (const [name, cat, price, rating, img, colors, sizes] of products) {
    const [res] = await conn.query(
      `INSERT INTO products (uuid, category_id, name, description, price, rating, image, other_images, available_colors, available_sizes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        catId[cat],
        name,
        `${name} — handcrafted in Ethiopia from premium natural fibers.`,
        price,
        rating,
        img.main,
        j(img.sub),
        j(colors),
        j(sizes),
      ]
    );
    productIds.push({ id: res.insertId, price });
  }

  // 6) Shipping fees.
  await conn.query(
    `INSERT INTO shipping_fee (uuid, country_name, country_code, starting_price, maximum_price) VALUES ?`,
    [
      [
        [uuidv4(), "Ethiopia", "ET", 5.0, 15.0],
        [uuidv4(), "United States", "US", 25.0, 60.0],
        [uuidv4(), "United Kingdom", "GB", 20.0, 50.0],
        [uuidv4(), "United Arab Emirates", "AE", 18.0, 45.0],
      ],
    ]
  );
  const [feeRows] = await conn.query("SELECT id, country_code FROM shipping_fee");
  const feeId = Object.fromEntries(feeRows.map((r) => [r.country_code, r.id]));

  // 7) Customers.
  const customers = [
    ["Hana", "Tesfaye", "hana@example.com", "+251911234567"],
    ["Daniel", "Bekele", "daniel@example.com", "+251922345678"],
    ["Sara", "Johnson", "sara@example.com", "+14155550123"],
  ];
  const customerIds = [];
  for (const [fn, ln, email, phone] of customers) {
    const [res] = await conn.query(
      "INSERT INTO customers (uuid, first_name, last_name, email, phone) VALUES (?, ?, ?, ?, ?)",
      [uuidv4(), fn, ln, email, phone]
    );
    customerIds.push(res.insertId);
  }

  // 8) Orders + ordered items + shipping addresses.
  const demoOrders = [
    {
      customer: customerIds[0],
      fee: feeId.ET,
      payment: "paid",
      order: "completed",
      delivery: "delivered",
      items: [{ p: productIds[0], q: 1 }, { p: productIds[5], q: 2 }],
      city: "Addis Ababa",
    },
    {
      customer: customerIds[1],
      fee: feeId.ET,
      payment: "pending",
      order: "processing",
      delivery: "not_shipped",
      items: [{ p: productIds[3], q: 3 }],
      city: "Bahir Dar",
    },
    {
      customer: customerIds[2],
      fee: feeId.US,
      payment: "paid",
      order: "processing",
      delivery: "in_transit",
      items: [{ p: productIds[6], q: 1 }, { p: productIds[1], q: 1 }],
      city: "San Francisco",
    },
  ];

  for (const o of demoOrders) {
    const total = o.items.reduce((s, it) => s + it.p.price * it.q, 0);
    const orderUuid = uuidv4();
    const [orderRes] = await conn.query(
      `INSERT INTO orders (uuid, customer_id, shipping_fee_id, payment_status, order_status, delivery_status, total_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderUuid, o.customer, o.fee, o.payment, o.order, o.delivery, total]
    );
    const orderId = orderRes.insertId;

    await conn.query(
      "INSERT INTO ordered_items (order_id, product_id, quantity, price) VALUES ?",
      [o.items.map((it) => [orderId, it.p.id, it.q, it.p.price])]
    );

    await conn.query(
      `INSERT INTO shipping_addresses (uuid, order_id, customer_id, city, street, phone_number)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), orderId, o.customer, o.city, "123 Knit Street", "+251911234567"]
    );
  }

  // 9) Currency rate.
  await conn.query(
    "INSERT INTO currency_rates (uuid, current_rate, reason) VALUES (?, ?, ?)",
    [uuidv4(), 167.0, "Initial demo rate"]
  );

  // 10) Contact messages.
  await conn.query(
    `INSERT INTO messages (uuid, first_name, last_name, email, subject, message) VALUES ?`,
    [
      [
        [uuidv4(), "Liya", "Abebe", "liya@example.com", "Custom order", "Can you make a custom sweater in size XXL?"],
        [uuidv4(), "Mark", "Lee", "mark@example.com", "Shipping", "Do you ship to Canada?"],
      ],
    ]
  );

  // 11) Revenue + analytics snapshots (so dashboards render immediately).
  const paidTotal = demoOrders
    .filter((o) => o.payment === "paid")
    .reduce((s, o) => s + o.items.reduce((a, it) => a + it.p.price * it.q, 0), 0);
  await conn.query(
    `INSERT INTO revenue (uuid, total_revenue, month_revenue, week_revenue, daily_revenue, monthly_trend)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [uuidv4(), paidTotal, paidTotal, paidTotal, paidTotal, j({})]
  );
  await conn.query(
    `INSERT INTO analytics (uuid, total_revenue, total_orders, total_products, total_customers, sales_data, revenue_data)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [uuidv4(), paidTotal, demoOrders.length, products.length, customers.length, j([]), j([])]
  );

  await conn.end();

  console.log("\n✅ Seed complete!");
  console.log("────────────────────────────────────────");
  console.log(`  Admin login:  ${adminEmail}`);
  console.log(`  Password:     ${adminPassword}`);
  console.log("────────────────────────────────────────");
  console.log(`  ${categoryNames.length} categories, ${products.length} products, ${customers.length} customers, ${demoOrders.length} orders`);
}

run().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
