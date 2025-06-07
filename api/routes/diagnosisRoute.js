import express from "express";
import { createDiagnosis } from "../controllers/diagnosisController.js";
import authDoctor from "../middlewares/authDoctor.js";

const diagnosisRouter = express.Router();

diagnosisRouter.post("/add", authDoctor, createDiagnosis);

export default diagnosisRouter;
