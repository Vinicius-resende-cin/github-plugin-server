import { MongoClient, ServerApiVersion } from "mongodb";
import { connectionString } from "../config";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(connectionString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

async function connectDb(name: string) {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db(name).command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");

    return client.db(name);
  } catch (e) {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.error(e);
  }
}

export { client, connectDb };
