const express = require("express");
const app = express();
const pool = require("./db");

app.use(express.json()) // => req.body

app.get("/products", async (req, res) => {
    try {
        const allProducts = await pool.query(
            "SELECT * FROM products"
        );
        res.json(allProducts.rows)
    } catch (err) {
        console.log(err.message);
    }
});

app.get("/products/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const product = await pool.query(
            "SELECT * FROM products WHERE products_id = $1",
            [id]
        );
        res.json(product.rows[0])
    } catch (err) {
        console.log(err.message);
    }
});

app.post("/products", async (req, res) => {
    try {
        const {name} = req.body;
        const {description} = req.body;
        const {price} = req.body;
        const {weight} = req.body;
        const {category} = req.body;

        if (price <= 0) {
            res.json('price is too low');
        }

        if (weight <= 0) {
            res.json('weight is too low');
        }

        const newProduct = await pool.query(
            "INSERT INTO products (name, description, price, weight, category)" +
            "VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, description, price, weight, category]
        );
        res.json(newProduct.rows[0]);
    } catch (err) {
        console.log(err.message);
    }
});

app.put("/products/:id", async (req, res) => {
    try {
        const {id} = req.params; //where
        const {name} = req.body; //set
        const {description} = req.body;
        const {price} = req.body;
        const {weight} = req.body;
        const {category} = req.body;

        if (price <= 0) {
            res.json('price is too low');
            return;
        }

        if (weight <= 0) {
            res.json('weight is too low');
            return;
        }
        const updateProduct = await pool.query(
            "UPDATE products SET name = $2, " +
            "description = $3, " +
            "price = $4, " +
            "weight = $5, " +
            "category = $6" +
            "WHERE products_id = $1" +
            "RETURNING *",
            [id, name, description, price, weight, category]
        );
        if (updateProduct.rows.length === 0) {
            res.json("Product dont exist!");
        } else {
            res.json("Product updated");
        }
    } catch (err) {
        console.log(err.message);
    }
});

app.delete("/products/:id", async (req, res) => {
    try {
        const {id} = req.params; //where
        const deleteProduct = await pool.query(
            "DELETE FROM products WHERE products_id = $1",
            [id]
        );
        res.json("Product was successfullu deleted!");
    } catch (err) {
        console.log(err.message);
    }
});

app.get("/categories", async (req, res) => {
    try {
        const allCategories = await pool.query(
            "SELECT * FROM category"
        );
        res.json(allCategories.rows);
    } catch (err) {
        console.log(err.message);
    }
});

app.get("/orders", async (req, res) => {
    try {
        const allOrders = await pool.query(
            "SELECT * FROM purchase_order"
        );
        res.json(allOrders.rows);
    } catch (err) {
        console.log(err.message);
    }
});

app.get("/orders/status/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const allOrders = await pool.query(
            "SELECT * FROM purchase_order" +
            " WHERE order_status = $1;",
            [id]
        );
        res.json(allOrders.rows);
    } catch (err) {
        console.log(err.message);
    }
});

app.get("/orders/status", async (req, res) => {
    try {
        const allStatus = await pool.query(
            "SELECT * FROM order_status;"
        );
        res.json(allStatus.rows);
    } catch (err) {
        console.log(err.message);
    }
});

app.post("/orders", async (req, res) => {
    try {
        const {user_name} = req.body;
        const {user_email} = req.body;
        const {user_phone_nr} = req.body;
        const {number_of_orders} = req.body;
        let num = number_of_orders.toString().valueOf();
        num = replaceAllChar(num);
        let tab = num;
        tab = tab.split(',')
        console.log(typeof tab);

        if (!checkUserInOrder(res, user_name, user_email, user_phone_nr)) {
            return;
        }

        try {
            const check = await pool.query(
                "SELECT doesnt_have_negative($1) " +
                "WHERE doesnt_have_negative($1) = false",
                [number_of_orders]
            );

            if (check.rows.length === 1) {
                res.json("Order contain negative numbers!");
                return;
            }
        } catch (err) {
            console.log(err.message);
        }

        try {
            console.log(tab);
            console.log("chuj");
            for (let i = 0; i < tab.length; i++) {
                tab.splice(i+1, 1);
            }
          //  console.log(Array.isArray(tab));
          //  console.log(typeof tab[1]);
            console.log(tab.toString());
            let intArr = [];
            intArr = tab.toString().split(',').map(Number);
            console.log(typeof intArr);
            console.log(intArr);
            for (const item of intArr) {
                let index = intArr.indexOf(item);
                console.log('x ' + item);
                const checkIdLoop = await pool.query(
                    "SELECT * FROM products " +
                    "WHERE products_id = $1 ",
                    [item]
                );
                if (checkIdLoop.rows.length === 0) {
                    res.json('Invalid product ' + item +' ID!');
                    return;
                }
            }
        } catch (err) {
            console.log(err.message);
        }

        // let que = "DO $$ BEGIN INSERT INTO purchase_order (user_name, user_email, user_phone_nr, number_of_orders) VALUES ($1, $2, $3, $4); EXCEPTION WHEN check_violation THEN RETURN; END; $$";

        //console.log(que);
        const newOrder = await pool.query(
            "INSERT INTO purchase_order (user_name, user_email, user_phone_nr, number_of_orders) " +
            "VALUES ($1, $2, $3, $4); ",
            [user_name, user_email, user_phone_nr, number_of_orders]
        );
        res.json("Order added!");
    } catch (err) {
        console.log(err.message);
    }
});

app.put("/orders/:id/:status", async (req, res) => {
    try {
        const {id} = req.params; //where
        const {status} = req.params; //where

        try {
            const idList = await pool.query(
                "SELECT purchase_order_id FROM purchase_order " +
                "WHERE purchase_order_id = $1;",
                [id]
            );
            console.log(idList.rows.length);
            if (idList.rows.length === 0) {
                res.json("Order does not exist!");
                return
            }
        } catch (err) {
            console.log(err.message);
        }

        const updateOrderStatus = await pool.query(
            "UPDATE purchase_order SET order_status = $2 " +
            "WHERE purchase_order_id = $1 AND " +
            "order_status < $2 " +
            "RETURNING *",
            [id, status]
        );
        console.log(updateOrderStatus.length)
        if (updateOrderStatus.rows.length === 0) {
            res.json("Product not updated, order status problem!");
        } else {
            res.json("Product updated!");
        }
    } catch (err) {
        console.log(err.message);
    }
});

app.listen(5000, () => {
    console.log("server is on port 5000");
});

function checkUserInOrder(res, user_name, user_email, user_phone_nr) {
    if (user_name.length === 0) {
        res.json('User name can not be empty!');
        return false;
    }

    if (user_email.length === 0) {
        res.json('User email can not be empty!');
        return false;
    }

    if (user_phone_nr.length === 0) {
        res.json('User phone number can not be empty!');
        return false;
    }
    let regex = new RegExp(/[0-9]/);
    if (!user_phone_nr.toString().match(regex)) {
        res.json('User phone number can not contain letters!');
        return false;
    }
    return true;
}

function replaceAllChar(num) {
    num = num.split('{').join('');
    num = num.split('}').join('');
    return num;
}
