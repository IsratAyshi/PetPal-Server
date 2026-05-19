const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object 
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

    const db = client.db("petpal");
    const petsCollection = db.collection("allPets");

    // ----- APIs -----

    // ---- All Pets ----
    app.get("/all-pets", async (req, res) => {
        const result = await petsCollection.find().toArray();
        res.json(result);
    });

    app.get("/all-pets/:id", async (req, res) => {
        const id = req.params.id;
        const result = await petsCollection.findOne(
            { _id: new ObjectId(id) }
        );
        res.json(result);
    });


    
    app.post("/all-pets", async (req, res) => {
      const petData = req.body;
      const result = await petsCollection.insertOne(petData);
      res.json(result);
    });

    app.patch("/all-pets/:id", async (req, res) => {
      const id = req.params.id;
      const updatedPetData = req.body;
      const result = await petsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedPetData }
      );
      res.json(result);
    });

    app.delete("/all-pets/:id", async (req, res) => {
      const id = req.params.id;
      const result = await petsCollection.deleteOne(
        { _id: new ObjectId(id) }
      );
      res.json(result);
    });
    
    
    app.get("/my-pets/:ownerId", async (req, res) => {
       const ownerId = req.params.ownerId;
       console.log(ownerId);

       const result = await petsCollection.find(
            {ownerId}
        ).toArray();
       res.json(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server is running fine!");
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});