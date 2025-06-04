import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/mysql.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }
    const [[existingUser]] = await pool.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashedPassword]
    );
    const userId = result.insertId;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [[user]] = await pool.execute(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const updateProfile = async (req, res) => {
  try {
    let { name, phone, address, address_line1, address_line2, dob, gender } =
      req.body;
    const userId = req.userId;
    const imageFile = req.file;
    if (address) {
      try {
        const parsed =
          typeof address === "string" ? JSON.parse(address) : address;
        address_line1 = parsed.line1 ?? address_line1 ?? "";
        address_line2 = parsed.line2 ?? address_line2 ?? "";
      } catch (e) {}
    }
    address_line1 = address_line1 ?? "";
    address_line2 = address_line2 ?? "";
    name = name ?? "";
    phone = phone ?? "";
    dob = dob ?? "";
    gender = gender ?? "";
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }
    await pool.execute(
      `UPDATE users SET name = ?, phone = ?, address_line1 = ?, address_line2 = ?, dob = ?, gender = ? WHERE id = ?`,
      [name, phone, address_line1, address_line2, dob, gender, userId]
    );
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;
      await pool.execute(`UPDATE users SET image = ? WHERE id = ?`, [
        imageURL,
        userId,
      ]);
    }
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const [[userData]] = await pool.execute(
      `SELECT id, name, email, image, address_line1, address_line2, gender, dob, phone FROM users WHERE id = ?`,
      [userId]
    );
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.userId;
    const [[docData]] = await pool.execute(
      `SELECT available, slots_booked, fees FROM doctors WHERE id = ?`,
      [docId]
    );
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }
    let slots_booked;
    if (typeof docData.slots_booked === "string") {
      slots_booked = JSON.parse(docData.slots_booked);
    } else if (
      typeof docData.slots_booked === "object" &&
      docData.slots_booked !== null
    ) {
      slots_booked = docData.slots_booked;
    } else {
      slots_booked = {};
    }
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
    }
    let formattedSlotDate = slotDate;
    if (/^\d{1,2}_\d{1,2}_\d{4}$/.test(slotDate)) {
      const [day, month, year] = slotDate.split("_");
      formattedSlotDate = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
    }
    let formattedSlotTime = slotTime;
    if (/\d{1,2}:\d{2} (AM|PM)/i.test(slotTime)) {
      const [time, modifier] = slotTime.split(" ");
      let [hours, minutes] = time.split(":");
      hours = parseInt(hours, 10);
      if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
      if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
      formattedSlotTime = `${String(hours).padStart(2, "0")}:${minutes}:00`;
    }
    await pool.execute(
      `INSERT INTO appointments (user_id, doctor_id, slot_date, slot_time, amount) VALUES (?, ?, ?, ?, ?)`,
      [userId, docId, formattedSlotDate, formattedSlotTime, docData.fees]
    );
    await pool.execute(`UPDATE doctors SET slots_booked = ? WHERE id = ?`, [
      JSON.stringify(slots_booked),
      docId,
    ]);
    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("listAppointment: userId", userId);
    const [appointments] = await pool.execute(
      `SELECT a.*, d.name AS doctor_name, d.image AS doctor_image, d.specialty AS doctor_specialty, d.degree AS doctor_degree, d.experience AS doctor_experience, d.about AS doctor_about, d.fees AS doctor_fees, d.address_line1, d.address_line2, d.available AS doctor_available
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.user_id = ?
      ORDER BY a.id DESC`,
      [userId]
    );
    console.log("listAppointment: raw appointments", appointments);
    const appointmentsWithDoc = appointments.map((a) => {
      let slotDate = a.slot_date;
      if (slotDate instanceof Date) {
        slotDate = `${slotDate.getDate()}_${
          slotDate.getMonth() + 1
        }_${slotDate.getFullYear()}`;
      } else if (
        typeof slotDate === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(slotDate)
      ) {
        const [year, month, day] = slotDate.split("-");
        slotDate = `${parseInt(day)}_${parseInt(month)}_${year}`;
      }
      let slotTime = a.slot_time;
      if (typeof slotTime === "string" && /^\d{2}:\d{2}/.test(slotTime)) {
        let [hours, minutes] = slotTime.split(":");
        hours = parseInt(hours);
        const ampm = hours >= 12 ? "PM" : "AM";
        let displayHour = hours % 12;
        if (displayHour === 0) displayHour = 12;
        slotTime = `${displayHour}:${minutes} ${ampm}`;
      }
      return {
        _id: a.id,
        userId: a.user_id,
        doctorId: a.doctor_id,
        slotDate,
        slotTime,
        amount: a.amount,
        cancelled: !!a.cancelled,
        payment: !!a.payment,
        isCompleted: !!a.is_completed,
        docData: {
          id: a.doctor_id,
          name: a.doctor_name,
          image: a.doctor_image,
          specialty: a.doctor_specialty,
          degree: a.doctor_degree,
          experience: a.doctor_experience,
          about: a.doctor_about,
          fees: a.doctor_fees,
          available: !!a.doctor_available,
          address: {
            line1: a.address_line1 || "",
            line2: a.address_line2 || "",
          },
        },
      };
    });
    res.json({ success: true, appointments: appointmentsWithDoc });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId;
    const [[appointmentData]] = await pool.execute(
      `SELECT * FROM appointments WHERE id = ?`,
      [appointmentId]
    );
    if (!appointmentData || appointmentData.user_id !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }
    await pool.execute(`UPDATE appointments SET cancelled = 1 WHERE id = ?`, [
      appointmentId,
    ]);
    const { doctor_id, slot_date, slot_time } = appointmentData;
    const [[doctorData]] = await pool.execute(
      `SELECT slots_booked FROM doctors WHERE id = ?`,
      [doctor_id]
    );
    let slots_booked;
    if (doctorData && typeof doctorData.slots_booked === "string") {
      slots_booked = JSON.parse(doctorData.slots_booked);
    } else if (
      doctorData &&
      typeof doctorData.slots_booked === "object" &&
      doctorData.slots_booked !== null
    ) {
      slots_booked = doctorData.slots_booked;
    } else {
      slots_booked = {};
    }
    if (slots_booked[slot_date]) {
      slots_booked[slot_date] = slots_booked[slot_date].filter(
        (e) => e !== slot_time
      );
    }
    await pool.execute(`UPDATE doctors SET slots_booked = ? WHERE id = ?`, [
      JSON.stringify(slots_booked),
      doctor_id,
    ]);
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
};
