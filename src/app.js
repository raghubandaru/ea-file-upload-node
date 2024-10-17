import express from "express";
import initDB from "./db/mongoose.js";

initDB();
const app = express();

app.get("/", (req, res) => {
  return res.send("Hey Raghu!!");
});

export default app;
