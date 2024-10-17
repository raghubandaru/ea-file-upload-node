import express from "express";
import mongoose from "mongoose";

const app = express();

app.listen(process.env.PORT, () => console.log("server is up and running"));

app.get("/", (req, res) => {
  return res.send("Hey Raghu!!");
});

const connectionURL = process.env.MONGO_CONNECTION_URL;

mongoose
  .connect(connectionURL)
  .then(() => console.log("Database is up and running"))
  .catch(() => console.log("Error connecting to Database"));
