const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");


const app = express();
const port = 3000;
app.use(cors());
const db = new sqlite3.Database("./ecommerce.db", (err) => {
    if (err) {
      console.error("❌ Could not connect to database", err);
    } else {
      console.log("✅ Connected to SQLite database");
    }
  });
  app.get("/api/products", (req, res) => {
    const sql = `
    SELECT products.*, departments.name AS department_name
    FROM products
    JOIN departments ON products.department_id = departments.id
  `;
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Database error" });
      } else {
        res.json(rows);
      }
    });
  });
  app.get("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const sql = `
  SELECT products.*, departments.name AS department_name
  FROM products
  JOIN departments ON products.department_id = departments.id
  WHERE products.id = ?
`;
    db.get(sql, [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: "Database error" });
      } else if (!row) {
        res.status(404).json({ error: "Product not found" });
      } else {
        res.json(row);
      }
    });
  });
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });