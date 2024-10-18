import express from "express";
import cors from "cors";
import initDB from "./db/mongoose.js";
import userRouter from "./routers/userRouter.js";

initDB();
const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  return res.send("Hey Raghu!!");
});

app.use(express.json());
app.use(userRouter);

export default app;
