import mongoose from "mongoose";

const connectionURL = process.env.MONGO_CONNECTION_URL;

export default function initDB() {
  mongoose
    .connect(connectionURL)
    .then(() => console.log("Database is up and running"))
    .catch(() => console.log("Error connecting to Database"));
}
