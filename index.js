const express = require("express");
const app = express();
const pool = require("./db");

app.use(express.json()) // => req.body

const router = express.Router();

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

app.listen(5000, () => {
    console.log("server is on port 5000");
});
