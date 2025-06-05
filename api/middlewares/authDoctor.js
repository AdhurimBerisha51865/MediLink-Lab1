import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "Not Authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.doctorId = decoded.id;

    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ success: false, message: error.message });
  }
};

export default authDoctor;
