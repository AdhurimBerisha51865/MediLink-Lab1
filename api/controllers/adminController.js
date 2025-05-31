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

export { addDoctor, loginAdmin };
