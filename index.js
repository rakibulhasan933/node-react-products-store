const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jyva3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db("products");
        const userCollation = database.collection("item");
        // POST API
        app.post('/products', async (req, res) => {
            // console.log('request accept', req.body);
            const newProduct = req.body;
            const result = await userCollation.insertOne(newProduct);
            console.log('data from database', result);
            res.json(result);
        });

        // GET API
        app.get('/products', async (req, res) => {
            const cursor = userCollation.find({})
            const products = await cursor.toArray();
            res.json(products);
        })
        // GET API ID FIND
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await userCollation.findOne(query);
            res.json(product);
        })
        // DELETE API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const productDelete = await userCollation.deleteOne(query);
            res.json(productDelete);
        });

        // PUT API

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updateProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateProduct.name,
                    description: updateProduct.description,
                    price: updateProduct.price,
                    img: updateProduct.img

                }
            }
            const result = await userCollation.updateOne(filter, updateDoc, options);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running CRUD server')
});
app.listen(port, () => {
    console.log('Running server port', port);
})