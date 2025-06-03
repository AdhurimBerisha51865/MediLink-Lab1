import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ success: false, message: error.message });
  }
};

export default authUser;
