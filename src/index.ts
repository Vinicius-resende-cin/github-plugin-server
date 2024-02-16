import express from "express";
import { serverPort } from "./config";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});
