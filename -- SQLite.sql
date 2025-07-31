DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS departments;

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
