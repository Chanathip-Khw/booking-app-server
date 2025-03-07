import pool from "../db.js";

export const bookDate = async (req, res) => {
  const { checkinDate, checkoutDate, name, phoneNumber, email } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      "INSERT INTO bookings (user_id, checkin_date, checkout_date, name, phone_number, email, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())",
      [userId, checkinDate, checkoutDate, name, phoneNumber, email]
    );

    res.status(201).json({ message: "Booking successful" });
  } catch (error) {
    console.error("Error in bookDate:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await pool.query(
      "SELECT * FROM bookings WHERE checkout_date >= CURRENT_DATE"
    );
    res.status(200).json(bookings.rows);
  } catch (error) {
    console.error("Error in getBookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
