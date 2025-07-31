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
    SELECT 
      products.*, 
      departments.name AS department_name 
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
    SELECT 
      products.*, 
      departments.name AS department_name 
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



app.get("/api/departments", (req, res) => {
  const sql = `
    SELECT 
      departments.id, 
      departments.name, 
      COUNT(products.id) AS product_count 
    FROM departments 
    LEFT JOIN products ON products.department_id = departments.id 
    GROUP BY departments.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(rows);
    }
  });
});



app.get("/api/departments/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM departments WHERE id = ?`;

  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
    } else if (!row) {
      res.status(404).json({ error: "Department not found" });
    } else {
      res.json(row);
    }
  });
});



app.get("/api/departments/:id/products", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      products.*, 
      departments.name AS department_name 
    FROM products 
    JOIN departments ON products.department_id = departments.id 
    WHERE departments.id = ?
  `;
  db.all(sql, [id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
    } else if (rows.length === 0) {
      res.status(404).json({ error: "No products found in this department" });
    } else {
      res.json(rows);
    }
  });
});



app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
