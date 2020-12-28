CREATE DATABASE aji_zad_4;

--SET search_path TO aji_zad_4, public;
-- w datagrip ustaw na kodem prawy górny róg na aji_zad_4

CREATE TABLE category
(
    category_id   SERIAL PRIMARY KEY,
    category_type VARCHAR(255)
);

CREATE TABLE order_status
(
    order_status_id SERIAL PRIMARY KEY,
    name            VARCHAR(32)
);

CREATE TABLE purchase_order
(
    purchase_order_id SERIAL PRIMARY KEY,
    confirmation_date DATE    DEFAULT CURRENT_DATE,
    order_status      INTEGER DEFAULT 1,
    user_name         VARCHAR(255),
    user_email        VARCHAR(255),
    user_phone_nr     VARCHAR(9),
    number_of_orders  INTEGER ARRAY,
    CONSTRAINT fk_order_status
        FOREIGN KEY (order_status)
            REFERENCES order_status (order_status_id)
);

CREATE TABLE products
(
    products_id SERIAL PRIMARY KEY,
    name        VARCHAR(64),
    description VARCHAR(255),
    price       MONEY,
    weight      DOUBLE PRECISION,
    category    INT,
    CONSTRAINT fk_category
        FOREIGN KEY (category)
            REFERENCES category (category_id),
    CONSTRAINT check_weight CHECK ( weight > 0 )
);

INSERT INTO category (category_type)
VALUES ('Electronic');

INSERT INTO category (category_type)
VALUES ('Book');

INSERT INTO category (category_type)
VALUES ('Home');

INSERT INTO category (category_type)
VALUES ('Fashion');

SELECT *
FROM category;

INSERT INTO order_status (name)
VALUES ('NOT_APPROVED');

INSERT INTO order_status (name)
VALUES ('APPROVED');

INSERT INTO order_status (name)
VALUES ('CANCELED');

INSERT INTO order_status (name)
VALUES ('COMPLETED');

SELECT *
FROM order_status;

INSERT INTO products (name, description, price, weight, category)
VALUES ('Macbook Pro 16', 'New macbook M1, new feature - zero usb, cannot be recharged',
        7000, 1.4, 1);

INSERT INTO products (name, description, price, weight, category)
VALUES ('The Godfather - Mario Puzo', 'novel about mafia',
        50, 0.5, 2);

SELECT *
FROM products;

