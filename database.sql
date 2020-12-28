CREATE DATABASE aji_zad_4;

--SET search_path TO aji_zad_4, public;
-- w datagrip ustaw na kodem prawy górny róg na aji_zad_4

CREATE FUNCTION doesnt_have_negative(t INTEGER[])
    RETURNS boolean
    IMMUTABLE
    STRICT
    LANGUAGE SQL
AS
$$
SELECT (NOT EXISTS(SELECT 1 FROM unnest(t) q WHERE q < 0))
$$;

CREATE FUNCTION include_in_products(t INTEGER[])
    RETURNS boolean
    IMMUTABLE
    STRICT
    LANGUAGE SQL
AS
$$
SELECT (NOT EXISTS(SELECT 1 FROM unnest(t) q WHERE q < 0));
$$;

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
            REFERENCES order_status (order_status_id),
    CONSTRAINT check_not_negative CHECK ( doesnt_have_negative(number_of_orders) )
);

--DROP TABLE purchase_order;

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

INSERT INTO purchase_order (user_name, user_email, user_phone_nr, number_of_orders)
VALUES ('Patryk', 'pat@ty.k', 999888777, '{{-1,2},{2,1},{3,3}}');

INSERT INTO purchase_order (user_name, user_email, user_phone_nr, number_of_orders)
VALUES ('Patryk', 'pat@ty.k', 999888777, ARRAY [[3,2],[1,1]]);

SELECT unnest(number_of_orders)
FROM purchase_order;

SELECT *
FROM purchase_order;



do
$$
    begin
        SELECT doesnt_have_negative(ARRAY[1,2]) WHERE doesnt_have_negative(ARRAY[1,-1]) = true;
        INSERT INTO purchase_order (user_name, user_email, user_phone_nr, number_of_orders)
        VALUES ('Patryk', 'pat@ty.k', 999888777, '{{1,2},{2,1},{3,3}}');
    EXCEPTION
        WHEN check_violation THEN RETURN;
    end;
$$;

select (number_of_orders[3][1]) from purchase_order ;

select products_id
from products
where products_id = 1;