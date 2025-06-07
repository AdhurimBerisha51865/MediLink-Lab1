import express from "express";
import {
  createDiagnosis,
  getDiagnoses,
} from "../controllers/diagnosisController.js";
import authDoctor from "../middlewares/authDoctor.js";

const diagnosisRouter = express.Router();

diagnosisRouter.post("/add", authDoctor, createDiagnosis);
diagnosisRouter.get("/get-diagnosis", authDoctor, getDiagnoses);

export default diagnosisRouter;
