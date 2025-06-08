import { pool } from "../config/mysql.js";

async function createDiagnosis(req, res) {
  try {
    const {
      user_id,
      appointment_id,
      diagnosis_title,
      description,
      diagnosis_date,
      medications = [],
      future_checkups = [],
    } = req.body;

    const doctor_id = req.doctorId;

    if (!user_id || !doctor_id || !diagnosis_title) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: user_id, doctor_id, and diagnosis_title are required",
      });
    }

    const [diagnosisResult] = await pool.execute(
      `INSERT INTO diagnosis (user_id, doctor_id, appointment_id, diagnosis_title, description, diagnosis_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        doctor_id,
        appointment_id || null,
        diagnosis_title,
        description || null,
        diagnosis_date ||
          new Date().toISOString().slice(0, 19).replace("T", " "),
      ]
    );
    const diagnosisId = diagnosisResult.insertId;

    if (medications.length > 0) {
      await Promise.all(
        medications.map((med) =>
          pool.execute(
            `INSERT INTO medications (diagnosis_id, medication_name, dosage, duration, notes)
             VALUES (?, ?, ?, ?, ?)`,
            [
              diagnosisId,
              med.medication_name,
              med.dosage,
              med.duration,
              med.notes || null,
            ]
          )
        )
      );
    }

    if (future_checkups.length > 0) {
      await Promise.all(
        future_checkups.map((checkup) =>
          pool.execute(
            `INSERT INTO future_checkups (diagnosis_id, checkup_date, purpose, notes)
             VALUES (?, ?, ?, ?)`,
            [
              diagnosisId,
              checkup.checkup_date,
              checkup.purpose,
              checkup.notes || null,
            ]
          )
        )
      );
    }

    return res.status(201).json({
      success: true,
      message: "Diagnosis created successfully",
      diagnosisId,
    });
  } catch (error) {
    console.error("Diagnosis creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create diagnosis",
      error: error.message,
    });
  }
}

async function getDiagnoses(req, res) {
  try {
    const { doctor_id } = req.query;
    let whereClause = "";
    let params = [];
    if (doctor_id) {
      whereClause = "WHERE d.doctor_id = ?";
      params.push(doctor_id);
    }
    const [diagnoses] = await pool.execute(
      `SELECT d.id AS diagnosis_id, d.diagnosis_title, d.description, d.diagnosis_date,
              u.id AS user_id, u.name AS patient_name, u.dob AS patient_dob, u.image AS patient_image,
              doc.id AS doctor_id, doc.name AS doctor_name
       FROM diagnosis d
       JOIN users u ON d.user_id = u.id
       JOIN doctors doc ON d.doctor_id = doc.id
       ${whereClause}
       ORDER BY d.diagnosis_date DESC`,
      params
    );
    const diagnosisIds = diagnoses.map((d) => d.diagnosis_id);
    let medications = [];
    if (diagnosisIds.length > 0) {
      const [meds] = await pool.execute(
        `SELECT diagnosis_id, medication_name, dosage, duration, notes
         FROM medications
         WHERE diagnosis_id IN (${diagnosisIds.map(() => "?").join(",")})`,
        diagnosisIds
      );
      medications = meds;
    }
    const medsMap = medications.reduce((acc, med) => {
      if (!acc[med.diagnosis_id]) acc[med.diagnosis_id] = [];
      acc[med.diagnosis_id].push({
        medication_name: med.medication_name,
        dosage: med.dosage,
        duration: med.duration,
        notes: med.notes,
      });
      return acc;
    }, {});
    const enrichedDiagnoses = diagnoses.map((d) => ({
      diagnosis_id: d.diagnosis_id,
      diagnosis_title: d.diagnosis_title,
      description: d.description,
      diagnosis_date: d.diagnosis_date,
      patient: {
        user_id: d.user_id,
        name: d.patient_name,
        dob: d.patient_dob,
        image: d.patient_image || null,
      },
      doctor: {
        doctor_id: d.doctor_id,
        name: d.doctor_name,
      },
      medications: medsMap[d.diagnosis_id] || [],
    }));
    return res.status(200).json({
      success: true,
      diagnoses: enrichedDiagnoses,
    });
  } catch (error) {
    console.error("Error fetching diagnoses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch diagnoses",
      error: error.message,
    });
  }
}

async function deleteDiagnosis(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Diagnosis ID is required",
      });
    }
    const [check] = await pool.execute(`SELECT * FROM diagnosis WHERE id = ?`, [
      id,
    ]);
    if (check.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Diagnosis not found",
      });
    }
    await pool.execute(`DELETE FROM medications WHERE diagnosis_id = ?`, [id]);
    await pool.execute(`DELETE FROM future_checkups WHERE diagnosis_id = ?`, [
      id,
    ]);
    await pool.execute(`DELETE FROM diagnosis WHERE id = ?`, [id]);
    return res.status(200).json({
      success: true,
      message: "Diagnosis deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting diagnosis:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete diagnosis",
      error: error.message,
    });
  }
}

async function updateDiagnosis(req, res) {
  try {
    const { id } = req.params;
    const { medications = [] } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Diagnosis ID is required",
      });
    }
    const [existing] = await pool.execute(
      `SELECT * FROM diagnosis WHERE id = ?`,
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Diagnosis not found",
      });
    }
    await pool.execute(`DELETE FROM medications WHERE diagnosis_id = ?`, [id]);
    if (medications.length > 0) {
      await Promise.all(
        medications.map((med) =>
          pool.execute(
            `INSERT INTO medications (diagnosis_id, medication_name, dosage, duration, notes)
             VALUES (?, ?, ?, ?, ?)`,
            [
              id,
              med.medication_name,
              med.dosage,
              med.duration,
              med.notes || null,
            ]
          )
        )
      );
    }
    return res.status(200).json({
      success: true,
      message: "Medications updated successfully",
    });
  } catch (error) {
    console.error("Update medications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update medications",
      error: error.message,
    });
  }
}

export { createDiagnosis, getDiagnoses, deleteDiagnosis, updateDiagnosis };
