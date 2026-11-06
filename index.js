import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";
import cors from "cors";
import { createRemoteJWKSet, createLocalJWKSet, jwtVerify } from "jose";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const mongoClient = await connectToMongoDB();
const db = mongoClient.db("wanderlust");
const destinationCollection = db.collection("destination");
// const userCollection = db.collection("user");
// const designCollection = db.collection("design");
// const db1 = mongoClient.db("horror");
// const horrorCollection = db1.collection("HORROR");
// const test_db = mongoClient.db("testing_db");
// const playerCollection = test_db.collection("player");
const bookingCollection = db.collection("bookings");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  if (!authHeader) {
    return res.status(401).send({ msg: "Unauthorized!" });
  }
  const token = authHeader.split(" ")[1];
  // console.log("Token : ", token);
  if (!token) {
    return res.status(401).send({ msg: "Unauthorized!" });
  }

  // Trailing slash মুক্ত ক্লিন লাইভ ফ্রন্টএন্ড URL
  const clientUrl = (
    process.env.CLIENT_URL && !process.env.CLIENT_URL.includes("localhost")
      ? process.env.CLIENT_URL
      : "https://wanderlust-frontend-livid.vercel.app"
  ).replace(/\/+$/, "");

  const jwksUrl = `${clientUrl}/api/auth/jwks`;

  try {
    // ১. সরাসরি JWKS ফেচ করা (এটি অটোমেটিক রিডাইরেক্ট হ্যান্ডেল করে)
    const jwksRes = await fetch(jwksUrl, {
      headers: { Accept: "application/json" },
    });

    if (!jwksRes.ok) {
      return res.status(500).send({
        msg: "Server Error!!!!",
        details: `JWKS URL (${jwksUrl}) returned status ${jwksRes.status}`,
      });
    }

    const jwksData = await jwksRes.json();
    const JWKS = createLocalJWKSet(jwksData);

    const { payload } = await jwtVerify(token, JWKS);
    req.user = payload;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(500).send({
      msg: "Server Error!!!!",
      details: error.message,
    });
  }
};

// Creating server --> http://localhost:8000
app.get("/add-destination", async (req, res) => {
  res.send(`Backend Destination API working!`);
});

// Fetch all the user data list in Backend API route -> http://localhost:8000/destinations
app.get("/destinations", async (req, res) => {
  const result = await destinationCollection.find().toArray();
  res.send(result);
});

app.get("/featured-destinations", async (req, res) => {
  const result = await destinationCollection.find().limit(5).toArray();
  res.send(result);
});

// User Added -->
app.post("/add-destination", verifyToken, async (req, res) => {
  const data = req.body;
  console.log(data);
  const result = await destinationCollection.insertOne(data);
  // const result1 = await userCollection.insertOne(data);
  console.log("Data : ", result);
  // console.log("API called at Backend terminal");
  res.send(result);
});

// Fetch specific user details data in Backend API route -> http://localhost:8000/destinations/:id
// ekhane verifyToken shorano hoyeche jate public view-te crash na hoy
app.get("/destinations/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id);

  // evabe nicher duita line likheo send kora jabe
  // const query = { _id: new ObjectId(id) };
  // const result = await destinationCollection.findOne(query);
  const result = await destinationCollection.findOne({
    _id: new ObjectId(id),
  });
  // res.send({ id });
  res.send(result);
});

// Edit specific data in backend and also update in MongoDB Database
app.patch("/destinations/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  // delete updatedData._id;  // using this we can prevent sending "_id" to the backend to change this immutable "_id"
  console.log(`Update destination Id: `, id, `with data: `, updatedData);
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: { ...updatedData },
  };
  const result = await destinationCollection.updateOne(filter, updateDoc);
  res.send(result);
});

// Delete specific data in backend and also update in MongoDB Database
app.delete("/destinations/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  // const query = { _id: new ObjectId(id) };
  const result = await destinationCollection.deleteOne({
    _id: new ObjectId(id),
  });
  res.send(result);
});

//localhost:8000/booking
// insert the booking data in the Backend API route - // http://localhost:8000/booking
app.post("/add-my-bookings", async (req, res) => {
  const data = req.body;
  if (data._id) {
    data.destinationId = data._id; // dorkar hole destinationId hishebe rekhe dewa
    delete data._id; // duplicate key 500 error atkate eita must
  }
  console.log(data);
  const result = await bookingCollection.insertOne(data);
  console.log(result);
  res.send(result);
});

app.get("/my-bookings", async (req, res) => {
  const result = await bookingCollection.find().toArray();
  res.send(result);
});

// show booking data list by searching email in Backend API route - // http://localhost:8000/my-bookings/maksudulhasanlimon@gmail.com
app.get("/my-bookings/:email", verifyToken, async (req, res) => {
  const { email } = req.params;
  console.log(email);
  const result = await bookingCollection.find({ email: email }).toArray();
  res.send(result);
});

// show booking data list by searching id in Backend API route - http://localhost:8000/my-booking-details/6ae0354746052cb621a88a38
// upore same route ache email er jonne ejonno backend jate ei specific route khuje pay
// ejonno route er name("/my-booking-details/:id") change kora hoyeche
app.get("/my-booking-details/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const query = { _id: ObjectId.isValid(id) ? new ObjectId(id) : id };
  const result = await bookingCollection.findOne(query);
  res.send(result);
});

// delete
app.delete("/my-booking-details/:id", async (req, res) => {
  const { id } = req.params;
  const query = { _id: ObjectId.isValid(id) ? new ObjectId(id) : id };
  const result = await bookingCollection.deleteOne(query);
  res.send(result);
});

app.get("/", (req, res) => {
  res.send({ messaage: `Server is running fine!` });
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

export default app;
