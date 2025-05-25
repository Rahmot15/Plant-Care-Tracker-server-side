const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 3000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@plants.7qpmfri.mongodb.net/?retryWrites=true&w=majority&appName=plants`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const plantCollection = client.db("plantDb").collection("plants")
        const userCollection = client.db("plantDb").collection('users')

        app.get('/plants', async (req, res) => {
            const result = await plantCollection.find().toArray()
            res.send(result)
        })

        app.get('/plants/:id', async (req, res) => {
            const { id } = req.params
            const query = { _id: new ObjectId(id) }
            const result = await plantCollection.findOne(query)
            res.send(result)
        })

        app.post('/plants', async (req, res) => {
            const newPlants = req.body
            console.log(newPlants);
            const result = await plantCollection.insertOne(newPlants)
            res.send(result)

        })

        app.put('/plants/:id', async (req, res) => {
            const { id } = req.params
            const { name, HealthStatus, PhotoUrl, Category, lastDate, nextDate, CareLevel, textarea } = req.body
            const query = { _id: new ObjectId(id) }

            const updateData = {
                $set: {
                    name,
                    HealthStatus,
                    PhotoUrl,
                    Category,
                    lastDate,
                    nextDate,
                    CareLevel,
                    textarea
                }
            }
            const result = await plantCollection.updateOne(query, updateData)
            res.send(result)
        })

        app.delete('/plants/:id', async (req, res) => {
            const { id } = req.params
            const query = { _id: new ObjectId(id) }
            const result = await plantCollection.deleteOne(query)
            res.send(result)
        })


        // User related apis
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray()
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const result = await userCollection.insertOne(req.body)
            res.send(result)
        })

        app.patch('/users', async (req, res) => {
            const { email, lastSignInTime } = req.body;
            const filter = {email: email}
            const updateDoc = {
                $set: {
                    lastSignInTime: lastSignInTime
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc)
            res.send(result)


        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello plants')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})