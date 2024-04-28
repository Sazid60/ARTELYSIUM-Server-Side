const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cjbmdks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const artCollection = client.db('artDB').collection('arts')

        // Get add craftArts
        app.get('/craftArts', async (req, res) => {
            const cursor = artCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // Get Specific Item
        app.get('/craftArts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await artCollection.findOne(query)
            res.send(result)
        })

        // Get UsingEmail Id
        app.get('/myItems/:email', async (req, res) => {
            const result = await artCollection.find({ user_email: req.params.email }).toArray()
            res.send(result)
        })

        // Get Using Category
        app.get('/categorizedData/:subcategory', async (req, res) => {
            const result = await artCollection.find({ subcategory_name: req.params.subcategory }).toArray()
            res.send(result)
        })
        // Add Craft & Art
        app.post('/craftArts', async (req, res) => {
            const newCraftArt = req.body;
            console.log(newCraftArt)
            const result = await artCollection.insertOne(newCraftArt);
            res.send(result)
        })

        // Update craft and Art Items 
        app.put('/craftArts/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCraftArts = req.body;

            const craftArts = {
                $set: {
                    image: updatedCraftArts.image,
                    item_name: updatedCraftArts.item_name,
                    subcategory_name: updatedCraftArts.subcategory_name,
                    price: updatedCraftArts.price,
                    rating: updatedCraftArts.rating,
                    customization: updatedCraftArts.customization,
                    description: updatedCraftArts.description,
                    processing_time: updatedCraftArts.processing_time,
                    stock_status: updatedCraftArts.stock_status,
                }
            }

            const result = await artCollection.updateOne(filter, craftArts, options);
            res.send(result);
        })


        // Delete
        app.delete('/craftArts/:id', async (req, res) => {
            const id = req.params.id
            console.log('Please delete', id)
            const query = { _id: new ObjectId(id) }
            const result = await artCollection.deleteOne(query)
            res.send(result)
        })

        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})