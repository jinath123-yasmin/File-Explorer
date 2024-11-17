// backend/server.js
const express = require("express");
const cors = require("cors");

require("dotenv").config();
const mongoose = require("mongoose");
const fileRoutes = require("./routes/FileRoute");

// require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log("MongoDB URI:", process.env.MONGODB_URL); 

// Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error(err));

mongoose
.connect(process.env.MONGODB_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=> console.log(`Connceted to mongo db...`))
.catch((err)=>console.log('Failed to connect to MongoDB:',err))

// API routes
app.use("/api/files", fileRoutes);

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
