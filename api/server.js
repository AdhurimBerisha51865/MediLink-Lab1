import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectMySQL } from "./config/mysql.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

connectMySQL();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log("Server Started", port));
