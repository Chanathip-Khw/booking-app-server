import pool from '../db.js';

// Book a date
export const bookDate = async (req, res) => {
  const { checkinDate, checkoutDate, name, phoneNumber, email } = req.body;
  const userId = req.user.id;

  try {
    // Insert booking into the database
    await pool.query(
      'INSERT INTO bookings (user_id, checkin_date, checkout_date, name, phone_number, email) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, checkinDate, checkoutDate, name, phoneNumber, email]
    );

    res.status(201).json({ message: 'Booking successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await pool.query('SELECT * FROM bookings');
    res.status(200).json(bookings.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};