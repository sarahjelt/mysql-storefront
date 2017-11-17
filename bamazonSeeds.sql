DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  item_id VARCHAR(10) NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(40) NULL,
  price DECIMAL(12,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("CD001", "Lincoln — They Might Be Giants (1988) — CD", "cds", 14.99, 14), 
("CD002", "OK Computer — Radiohead (1997) — CD", "cds", 16.99, 30), 
("CD003", "Modern Life Is Rubbish — Blur (1993) — CD", "cds", 17.99, 12), 
("CD004", "The Bends — Radiohead (1995) — CD", "cds", 14.99, 50), 
("VN001", "Apollo 18 — They Might Be Giants (1992) — Vinyl", "vinyls", 28.99, 11), 
("VN002", "Hounds of Love — Kate Bush (1985) — Vinyl", "vinyls", 26.99, 28), 
("VN003", "Flood — They Might Be Giants (1990) — Vinyl", "vinyls", 27.99, 33), 
("CS001", "John Henry — They Might Be Giants (1994) — Cassette", "cassettes", 10.99, 30), 
("CS002", "The Sensual World — Kate Bush (1989) — Cassette", "cassettes", 11.99, 4), 
("CS003", "Different Class — Pulp (1995) — Cassette", "cassettes", 12.99, 40);
