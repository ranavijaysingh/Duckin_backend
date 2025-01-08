const duckdb = require('duckdb');

class Database {
  constructor() {
    this.db = new duckdb.Database(':memory:');
    this.initializeDatabase();
  }

  initializeDatabase() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY,
        name VARCHAR,
        country VARCHAR,
        total_spent DECIMAL(10,2)
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY,
        customer_id INTEGER,
        amount DECIMAL(10,2),
        order_date DATE,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      );

      -- Insert sample data if tables are empty
      INSERT INTO customers 
      SELECT * FROM (VALUES
        (1, 'John Doe', 'USA', 1500.00),
        (2, 'Jane Smith', 'UK', 2500.00),
        (3, 'Bob Johnson', 'Canada', 800.00),
        (4, 'Alice Brown', 'USA', 3000.00),
        (5, 'Charlie Wilson', 'UK', 1200.00)
      ) AS t
      WHERE NOT EXISTS (SELECT 1 FROM customers LIMIT 1);

      INSERT INTO orders
      SELECT * FROM (VALUES
        (1, 1, 500.00, '2024-02-01'),
        (2, 2, 1000.00, '2024-02-15'),
        (3, 4, 1500.00, '2024-03-01'),
        (4, 2, 1500.00, '2024-03-10'),
        (5, 3, 800.00, '2024-03-15')
      ) AS t
      WHERE NOT EXISTS (SELECT 1 FROM orders LIMIT 1);
    `);
  }

  query(sql) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = new Database();