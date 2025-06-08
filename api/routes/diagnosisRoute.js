import express from "express";
import {
  createDiagnosis,
  deleteDiagnosis,
  getDiagnoses,
  updateDiagnosis,
} from "../controllers/diagnosisController.js";
import authDoctor from "../middlewares/authDoctor.js";

const diagnosisRouter = express.Router();

diagnosisRouter.post("/add", authDoctor, createDiagnosis);
diagnosisRouter.get("/get-diagnosis", authDoctor, getDiagnoses);
diagnosisRouter.delete("/delete-diagnosis/:id", authDoctor, deleteDiagnosis);
diagnosisRouter.put("/update-diagnosis/:id", authDoctor, updateDiagnosis);

export default diagnosisRouter;
