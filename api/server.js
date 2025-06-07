import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectMySQL } from "./config/mysql.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import diagnosisRouter from "./routes/diagnosisRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

connectMySQL();
connectCloudinary();

// middlewares
app.use(cors());
app.use(express.json());

// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/diagnosis", diagnosisRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log(`Server started on port ${port}`));
