import app from "./app.js";

app.listen(process.env.PORT || 5001, () =>
  console.log("server is up and running"),
);
