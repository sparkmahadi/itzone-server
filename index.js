require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");
// const product = require('./products.json');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gp7ekja.mongodb.net/?retryWrites=true&w=majority`;
// const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
  try {
    const db = client.db("itzone");
    const productCollection = db.collection("products");

    app.get("/products", async (req, res) => {
      const query = {};
      const result = await productCollection.find(query).toArray();
      res.send({ status: true, data: result });
    });

    app.post("/product", async (req, res) => {
      const product = req.body;

      const result = await productCollection.insertOne(product);

      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.patch("/product/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const newProduct = req.body;
      // console.log(newProduct);
      const filter = { _id: ObjectId(id) };
      // console.log(filter);
      const options = { upsert: true };
      let updateDoc = {};


      if (newProduct.status) {
        updateDoc = {
          $set: {
            model: newProduct.model,
            brand: newProduct.brand,
            status: true,
            price: newProduct.price,
            keyFeature: newProduct.keyFeature,
            spec: [],
          },
        }
      }
      else {
        updateDoc = {
          $set: {
            model: newProduct.model,
            brand: newProduct.brand,
            status: false,
            price: newProduct.price,
            keyFeature: newProduct.keyFeature,
            spec: [],
          },
        }
      }
      const result = await productCollection.updateOne(filter, updateDoc, options);

      res.send(result);
    })
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
