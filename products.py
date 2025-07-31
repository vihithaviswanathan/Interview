import pandas as pd
import sqlite3
df = pd.read_csv('products.csv')
conn = sqlite3.connect('ecommerce.db')
cursor = conn.cursor()
cursor.execute('''
CREATE TABLE IF NOT EXISTs products (
               id INTEGER PRIMARY KEY, 
               cost REAL,
               category TEXT,
               name TEXT,
               brand TEXT,
               retail_price REAL,
               department TEXT,
               sku TEXT,
               distributiom_center_id_INTEGER
               )

''')

df.to_sql('products', conn, if_exists='replace', index=False)
rows = cursor.execute("SELECT * FROM products LIMIT 5")
for row in rows:
    print(row)
conn.close()