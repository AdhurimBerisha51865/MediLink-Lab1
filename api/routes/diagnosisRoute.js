import express from "express";
import {
  createDiagnosis,
  deleteDiagnosis,
  getDiagnoses,
} from "../controllers/diagnosisController.js";
import authDoctor from "../middlewares/authDoctor.js";

const diagnosisRouter = express.Router();

diagnosisRouter.post("/add", authDoctor, createDiagnosis);
diagnosisRouter.get("/get-diagnosis", authDoctor, getDiagnoses);
diagnosisRouter.delete("/delete-diagnosis/:id", authDoctor, deleteDiagnosis);

export default diagnosisRouter;
