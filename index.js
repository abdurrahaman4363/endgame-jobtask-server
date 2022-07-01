
const express = require('express')
const cors = require('cors');
require('dotenv').config();
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//maddleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j7edy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
     
    try{
        await client.connect();
        console.log('Database is connected');
        const taskCollection = client.db('endgame_jobtask').collection('tasks');

        app.get('/task', async(req, res)=>{
            const query = {};
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);

        })
        app.get('/task/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const tasks =await taskCollection.findOne(query);
            res.send(tasks);

        })

        app.post('/task', async (req, res) => {
            const addItem = req.body;
            const result = await taskCollection.insertOne(addItem);
            res.send(result);
        })
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            const filter = { _id:ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: update,
            };
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            
            res.send(result);
        })

    }
    finally{

    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('This is from endgame');
})

app.listen(port, () => {
  console.log(`Endgame app listening on port ${port}`)
})