const mongoose = require("mongoose");
const express = require("express");
const Product = require("./models/product.model.js");

const app = express();

app.use(express.json());

const mongoDBUri = process.env.MONGO_DB_URI;

mongoose
  .connect(mongoDBUri)
  .then(() => {
    console.log("Connected to db!");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.get("/", (req, res) => {
  res.send("Learn node api!");
});

app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ie: http://127.0.0.1:3000/api/products/6614e6a97047a7782b7beb86
app.get("/api/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update
app.put("/api/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    const updatedProduct = await Product.findById(id);
    return res.status(201).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete
app.delete("/api/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }
    return res.status(201).json({ message: "Product Deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
