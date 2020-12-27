const express = require("express");
const app = express();
const pool = require("./db");

app.use(express.json()) // => req.body

//routes

//get all

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

//get one

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

// create

app.post("/products", async (req, res) => {
    try {
        const {name} = req.body;
        const {description} = req.body;
        const {price} = req.body;
        const {weight} = req.body;
        const {category} = req.body;

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

//update

app.put("/products/:id", async (req, res) => {
    try {
        const {id} = req.params; //where
        const {name} = req.body; //set
        const {description} = req.body;
        const {price} = req.body;
        const {weight} = req.body;
        const {category} = req.body;

        const updateProduct = await pool.query(
            "UPDATE products SET name = $2, " +
            "description = $3, " +
            "price = $4, " +
            "weight = $5, " +
            "category = $6" +
            "WHERE products_id = $1;",
            [id, name, description, price, weight, category]
        );
        res.json("Product updated!");
    } catch (err) {
        console.log(err.message);
    }
});

//delete

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

app.post("/orders", async (req, res) => {
    try {
        const {user_name} = req.body;
        const {user_email} = req.body;
        const {user_phone_nr} = req.body;
        const {number_of_orders} = req.body;

        const newOrder = await pool.query(
            "INSERT INTO purchase_order (user_name, user_email, user_phone_nr, number_of_orders)" +
            "VALUES ($1, $2, $3, $4) RETURNING *",
            [user_name, user_email, user_phone_nr, number_of_orders]
        );
        res.json(newOrder.rows[0]);
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

app.put("/orders/:id/status", async (req, res) => {
    try {
        const {id} = req.params; //where
        const {order_status} = req.body; //set


        const updateOrderStatus = await pool.query(
            "UPDATE purchase_order SET order_status = $2 " +
            "WHERE purchase_order_id = $1;",
            [id, order_status]
        );
        res.json("Product updated!");
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

app.listen(5000, () => {
    console.log("server is on port 5000");
});
