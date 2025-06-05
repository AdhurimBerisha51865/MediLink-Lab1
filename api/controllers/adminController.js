import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import { pool } from "../config/mysql.js";

const addDoctor = async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      specialty,
      degree,
      experience,
      about,
      fees,
      address_line1,
      address_line2,
      address,
    } = req.body;
    const imageFile = req.file;

    if (address && (!address_line1 || !address_line2)) {
      try {
        const parsed =
          typeof address === "string" ? JSON.parse(address) : address;
        address_line1 = parsed.line1 || address_line1;
        address_line2 = parsed.line2 || address_line2;
      } catch (e) {
        return res.json({ success: false, message: "Invalid address format" });
      }
    }

    if (
      !name ||
      !email ||
      !password ||
      !specialty ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address_line1 ||
      !address_line2
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = null;
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      imageUrl = imageUpload.secure_url;
    } else {
      imageUrl = "data:image/png;base64,iVBORw0KG...";
    }

    await pool.execute(
      `INSERT INTO doctors (name, email, password, image, specialty, degree, experience, about, fees, address_line1, address_line2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        hashedPassword,
        imageUrl,
        specialty,
        degree,
        experience,
        about,
        fees,
        address_line1,
        address_line2,
      ]
    );

    res.json({ success: true, message: "Doctor successfully added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const appointmentsAdmin = async (req, res) => {
  try {
    const [appointments] = await pool.execute(
      `SELECT a.*, 
              u.id AS user_id, u.name AS user_name, u.image AS user_image, u.dob AS user_dob, u.gender AS user_gender, u.phone AS user_phone,
              d.id AS doctor_id, d.name AS doctor_name, d.image AS doctor_image, d.specialty AS doctor_specialty, d.degree AS doctor_degree, d.experience AS doctor_experience, d.about AS doctor_about, d.fees AS doctor_fees, d.available AS doctor_available, d.address_line1, d.address_line2
       FROM appointments a
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN doctors d ON a.doctor_id = d.id
       ORDER BY a.id DESC`
    );
    const appointmentsMapped = appointments.map((a) => ({
      _id: a.id,
      userId: a.user_id,
      doctorId: a.doctor_id,
      slotDate: a.slot_date,
      slotTime: a.slot_time,
      amount: a.amount,
      cancelled: !!a.cancelled,
      payment: !!a.payment,
      isCompleted: !!a.is_completed,
      userData: {
        id: a.user_id,
        name: a.user_name || "Unknown Patient",
        image: a.user_image || "",
        dob: a.user_dob || "",
        gender: a.user_gender || "",
        phone: a.user_phone || "",
      },
      docData: {
        id: a.doctor_id,
        name: a.doctor_name || "Unknown Doctor",
        image: a.doctor_image || "",
        specialty: a.doctor_specialty || "",
        degree: a.doctor_degree || "",
        experience: a.doctor_experience || "",
        about: a.doctor_about || "",
        fees: a.doctor_fees || 0,
        available: !!a.doctor_available,
        address: {
          line1: a.address_line1 || "",
          line2: a.address_line2 || "",
        },
      },
    }));
    res.json({ success: true, appointments: appointmentsMapped });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const allDoctors = async (req, res) => {
  try {
    const [doctors] = await pool.execute(
      `SELECT id, name, email, image, specialty, degree, experience, about, available, fees, address_line1, address_line2, slots_booked FROM doctors`
    );
    const doctorsWithParsedSlots = doctors.map((doc) => ({
      ...doc,
      slots_booked:
        typeof doc.slots_booked === "string"
          ? JSON.parse(doc.slots_booked)
          : doc.slots_booked || {},
    }));
    res.json({ success: true, doctors: doctorsWithParsedSlots });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const [[appointmentData]] = await pool.execute(
      `SELECT * FROM appointments WHERE id = ?`,
      [appointmentId]
    );
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }
    await pool.execute(`UPDATE appointments SET cancelled = 1 WHERE id = ?`, [
      appointmentId,
    ]);
    const { doctor_id, slot_date, slot_time } = appointmentData;
    const [[doctorData]] = await pool.execute(
      `SELECT slots_booked FROM doctors WHERE id = ?`,
      [doctor_id]
    );
    let slots_booked =
      doctorData && doctorData.slots_booked
        ? JSON.parse(doctorData.slots_booked)
        : {};
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

export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel };
