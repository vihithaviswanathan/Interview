import pandas as pd
import sqlite3

# Read CSV
df = pd.read_csv("products.csv")

# Connect to DB
conn = sqlite3.connect("ecommerce.db")
cursor = conn.cursor()

# Drop and create tables
cursor.executescript('''
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS products;

CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    cost REAL,
    category TEXT,
    name TEXT,
    brand TEXT,
    retail_price REAL,
    department_id INTEGER,
    sku TEXT UNIQUE,
    distribution_center_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
''')

# Insert unique departments
departments = df["department"].dropna().unique()
for name in departments:
    cursor.execute("INSERT INTO departments (name) VALUES (?)", (name,))

# Create a lookup for department_id
cursor.execute("SELECT id, name FROM departments")
dept_map = {name: dept_id for dept_id, name in cursor.fetchall()}

# Replace department name with department_id
df["department_id"] = df["department"].map(dept_map)
df = df.drop(columns=["department"])  # drop old department name

# Write to products table
df.to_sql("products", conn, if_exists="append", index=False)

# Verify
rows = cursor.execute("SELECT * FROM products LIMIT 5")
for row in rows:
    print(row)

conn.commit()
conn.close()
