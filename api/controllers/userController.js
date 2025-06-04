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

export { registerUser, loginUser, getProfile, updateProfile };

