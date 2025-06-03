import { pool } from "../config/mysql.js";

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

export { changeAvailability, doctorList };
