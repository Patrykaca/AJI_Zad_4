CREATE DATABASE aji_zad_4;

--\c into aji_zad_4

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
    confirmation_date DATE,
    order_status      INT,
    user_name         VARCHAR(255),
    user_email        VARCHAR(255),
    user_phone_nr     VARCHAR(9),
    number_of_orders  VARCHAR(255)
);

CREATE TABLE products
(
    products_id SERIAL PRIMARY KEY,
    name        VARCHAR(64),
    description VARCHAR(255),
    price       MONEY,
    weight      DOUBLE PRECISION,
    category    INT
);

INSERT INTO category (category_type)
VALUES ('Electronic');

INSERT INTO category (category_type)
VALUES ('Book');

INSERT INTO category (category_type)
VALUES ('Home');

INSERT INTO category (category_type)
VALUES ('Fashion');

SELECT * FROM category;

INSERT INTO order_status (name)
VALUES ('NOT_APPROVED');

INSERT INTO order_status (name)
VALUES ('APPROVED');

INSERT INTO order_status (name)
VALUES ('CANCELED');

INSERT INTO order_status (name)
VALUES ('COMPLETED');

SELECT * FROM order_status;
