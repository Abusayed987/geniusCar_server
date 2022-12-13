const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 4000;

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dptn3ue.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('geniusCar').collection('services')
        const orderCollection = client.db('geniusCar').collection('orders')

        // read,get (find,get) Multiple data from mongoDb
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })

        //read, get (dynamic data/singleData) from mongoDb
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        //orders API for get specific  data from mongoDb !
        // v6
        app.get('/orders', async (req, res) => {
            //url link ta server display side er

            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = orderCollection.find(query)
            const orders = await cursor.toArray()
            res.send(orders)
        })

        // orders API for create ( insert, send ) a data to mongoDb
        app.post('/orders', async (req, res) => {
            //url link ta Client side er
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(err => console.err(err))


app.get('/', (req, res) => {
    res.send('genius car server is Running !!!')
})


app.listen(port, () => {
    console.log(`server running on port: ${port}`);
})
