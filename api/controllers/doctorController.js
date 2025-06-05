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

const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.doctorId;
    const [appointments] = await pool.execute(
      `SELECT 
        a.id, a.user_id, a.doctor_id, 
        a.slot_date, a.slot_time, a.amount, 
        a.cancelled, a.payment, a.is_completed,
        u.id AS user_real_id, u.name AS user_name, 
        u.image AS user_image, u.dob AS user_dob,
        u.gender AS user_gender, u.phone AS user_phone
      FROM appointments a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.doctor_id = ?
      ORDER BY a.slot_date DESC, a.slot_time DESC`,
      [docId]
    );

    const appointmentsWithUser = appointments.map((a) => {
      return {
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
          id: a.user_real_id,
          name: a.user_name || "Unknown Patient",
          image: a.user_image || "",
          dob: a.user_dob || "",
          gender: a.user_gender || "",
          phone: a.user_phone || "",
        },
      };
    });

    res.json({ success: true, appointments: appointmentsWithUser });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentComplete = async (req, res) => {
  try {
    const docId = req.doctorId;
    const { appointmentId } = req.body;
    const [[appointmentData]] = await pool.execute(
      `SELECT * FROM appointments WHERE id = ?`,
      [appointmentId]
    );
    if (appointmentData && appointmentData.doctor_id === docId) {
      await pool.execute(
        `UPDATE appointments SET is_completed = 1 WHERE id = ?`,
        [appointmentId]
      );
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentCancel = async (req, res) => {
  try {
    const docId = req.doctorId;
    const { appointmentId } = req.body;
    const [[appointmentData]] = await pool.execute(
      `SELECT * FROM appointments WHERE id = ?`,
      [appointmentId]
    );
    if (appointmentData && appointmentData.doctor_id === docId) {
      await pool.execute(`UPDATE appointments SET cancelled = 1 WHERE id = ?`, [
        appointmentId,
      ]);
      return res.json({ success: true, message: "Appointment Canceled" });
    } else {
      return res.json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorDashboard = async (req, res) => {
  try {
    const docId = req.doctorId;
    const [appointments] = await pool.execute(
      `SELECT 
        a.id, a.user_id, a.doctor_id, a.slot_date, a.slot_time, a.amount, 
        a.cancelled, a.payment, a.is_completed,
        u.id AS user_real_id, u.name AS user_name, u.image AS user_image, u.dob AS user_dob, u.gender AS user_gender, u.phone AS user_phone
      FROM appointments a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.doctor_id = ?
      ORDER BY a.slot_date DESC, a.slot_time DESC`,
      [docId]
    );
    let earnings = 0;
    let patients = new Set();
    appointments.forEach((item) => {
      if (item.is_completed || item.payment) {
        earnings += Number(item.amount);
      }
      patients.add(item.user_id);
    });
    const latestAppointments = appointments.slice(0, 10).map((a) => ({
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
        id: a.user_real_id,
        name: a.user_name || "Unknown Patient",
        image: a.user_image || "",
        dob: a.user_dob || "",
        gender: a.user_gender || "",
        phone: a.user_phone || "",
      },
    }));
    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.size,
      latestAppointments,
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorProfile = async (req, res) => {
  try {
    const docId = req.doctorId;
    const [[profileData]] = await pool.execute(
      `SELECT id, name, email, image, specialty, degree, experience, about, available, fees, address_line1, address_line2 FROM doctors WHERE id = ?`,
      [docId]
    );
    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.doctorId;
    const { fees, address_line1, address_line2, available } = req.body;
    await pool.execute(
      `UPDATE doctors SET fees = ?, address_line1 = ?, address_line2 = ?, available = ? WHERE id = ?`,
      [fees, address_line1, address_line2, available, docId]
    );
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
};
