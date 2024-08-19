import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import mongoose from "mongoose";

// Initialize the Express app
const app = express();
const port = 3000;

// MongoDB Atlas connection string
const mongoUri =
  "mongodb+srv://hariharan23052001:Hari@youtube.0ezzfj3.mongodb.net/mydatabase";

// Middleware
app.use(cors());
app.use(express.json());

const contactSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  phoneNumber: { type: String, unique: true, required: true },
});

const Contact = mongoose.model("Contact", contactSchema);

// Connect to MongoDB using Mongoose
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB connected...");

    // Start the server only after a successful database connection
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error(`DB Connection Error: ${err.message}`);
    process.exit(1); // Exit the process with a failure code
  });

// Endpoint to save a mobile number
app.post("/api/save-number", async (req, res) => {
  let { name, phoneNumber } = req.body;

  // Check if name and phone number are provided
  if (!name || !phoneNumber) {
    return res
      .status(400)
      .json({ error: "Name and phone number are required" });
  }

  // Validate the phone number (10 digits and starting with an Indian prefix)
  const phoneRegex = /^[6-9]\d{9}$/;

  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({
      error:
        "Invalid phone number. Must be a 10-digit Indian number starting with 6-9.",
    });
  }

  // Prefix the phone number with the Indian country code
  const fullPhoneNumber = `+91${phoneNumber}`;

  try {
    // Check if the phone number or name already exists
    const existingContact = await mongoose.connection.db
      .collection("contacts")
      .findOne({ $or: [{ phoneNumber: fullPhoneNumber }, { name }] });

    if (existingContact) {
      return res
        .status(400)
        .json({ error: "Name or phone number already exists" });
    }

    // Save the number if valid and unique
    await mongoose.connection.db
      .collection("contacts")
      .insertOne({ name, phoneNumber: fullPhoneNumber });
    res.json({ message: "Number saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save number" });
  }
});

// Endpoint to call a contact by name
app.get("/api/call-contact/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const contact = await Contact.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    if (!contact) {
      return res.json({
        success: false,
        message: `Contact with name ${name} not found.`,
      });
    }

    // Simulate making a call (this is where you could integrate with a real call API if needed)
    const message = `Calling ${contact.name} at ${contact.phoneNumber}...`;
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to make the call." });
  }
});

// Endpoint to get all saved numbers
app.get("/api/get-numbers", async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve numbers" });
  }
});

// Endpoint to fetch nearby restaurants
app.get("/api/nearby-restaurants", async (req, res) => {
  const { location } = req.query;
  const apiKey = "AIzaSyB-PAw7D4d8Ocx30WKc1CPcV7wVFB3IgVc";

  const radius = 10000; // Radius in meters

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=restaurant&key=${apiKey}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
