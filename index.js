import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import roomsRoute from "./routes/rooms.js";
import hotelsRoute from "./routes/hotels.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const corsOpts = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOpts));

dotenv.config();

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to db");
  } catch (err) {
    throw err;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middleware
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/hotels", hotelsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connectdb();
  console.log(`server is running on PORT ${8800}`);
});

//TODO:
