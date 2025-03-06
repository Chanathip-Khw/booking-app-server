import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return { accessToken, refreshToken };
};

// Register a new user
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into the database
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [name, email, hashedPassword]
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser.rows[0].id);

    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login a user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.rows[0].id);

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Refresh tokens
export const refreshTokens = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { accessToken } = generateTokens(decoded.id);
    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Error in refreshTokens:", error);
    res
      .status(401)
      .json({ message: "Invalid refresh token", error: error.message });
  }
};

// Logout a user
export const logout = (req, res) => {
  // Invalidate the token on the client side
  res.status(200).json({ message: "Logout successful" });
};

// Fetch user data controller
export const getUserData = async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: user.rows[0] });
  } catch (error) {
    console.error("Error in getUserData:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
