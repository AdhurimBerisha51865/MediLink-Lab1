import { pool } from "../config/mysql.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const [[docData]] = await pool.execute(
      `SELECT available FROM doctors WHERE id = ?`,
      [docId]
    );
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }
    await pool.execute(`UPDATE doctors SET available = ? WHERE id = ?`, [
      !docData.available,
      docId,
    ]);
    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const [doctors] = await pool.execute(
      `SELECT id, name, image, specialty, degree, experience, about, available, fees, address_line1, address_line2 FROM doctors`
    );
    const doctorsWithParsedSlots = doctors.map((doc) => ({
      ...doc,
      slots_booked: doc.slots_booked ? JSON.parse(doc.slots_booked) : {},
    }));
    res.json({ success: true, doctors: doctorsWithParsedSlots });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [[doctor]] = await pool.execute(
      `SELECT * FROM doctors WHERE email = ?`,
      [email]
    );
    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor.id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { changeAvailability, doctorList, loginDoctor };
