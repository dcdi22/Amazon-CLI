DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(150),
    department_name  VARCHAR(50),
    price DECIMAL(10, 2),
    stock_quantity INT,
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
("Bear Skin Rug", "Home Furnishings", 10000, 6),
("1st Edition Holographic Charizard Pokemon Card", "Antiques", 1999.99, 3),
("20 Gallon Steel Drum of Chick Fil A Special Sauce", "Food", 169.50, 100),
("Non-Rebounding Boomerang", "Weapons", 45.67, 1000),
("Tub of Live Dolphins", "Home Furnishings", 666.66, 75),
("Buttonless Videogame Controller", "Video Games", 18.98, 250),
("Dog Bark Amplifier", "Pets", 8.23, 100),
("Eyelash Shampoo", "Health & Beauty", 13.65, 200),
("Croc Beard", "Health & Beauty", 25.50, 89),
("Snake Javelin", "Athletics", 17.95, 3456),
("One Damn Fine Slice, of Cherry Pie", "Food", 1.68, 1);


SELECT * FROM products;