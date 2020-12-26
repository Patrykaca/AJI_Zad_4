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
        const {description} = req.body;
        const newProduct = await pool.query(
            "INSERT INTO products (description)" +
            "VALUES ($1) RETURNING *",
            [description]
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
        const {description} = req.body; //set

        const updateProduct = await pool.query(
            "UPDATE products SET description = $1 WHERE products_id = $2;",
            [description, id]
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

app.listen(5000, () => {
    console.log("server is on port 5000");
});
