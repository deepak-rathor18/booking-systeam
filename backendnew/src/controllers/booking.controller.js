const db = require("../cofing/db");

async function getBookings(req, res) {
  try {
    const { date } = req.query;

    let query = "SELECT * FROM bookings";
    const params = [];

    if (date) {
      query += " WHERE DATE(start) = ?";
      params.push(date);
    }

    query += " ORDER BY start ASC";

    const [bookings] = await db.execute(query, params);

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function createBooking(req, res) {
  try {
    const { room_id, title, email, attendees, start, end } = req.body;

    const [result] = await db.execute(
      "INSERT INTO bookings (room_id, title, email, attendees, start, end) VALUES (?, ?, ?, ?, ?, ?)",
      [room_id, title, email, attendees, start, end],
    );

    res.status(201).json({
      id: result.insertId,
      room_id,
      title,
      email,
      attendees,
      start,
      end,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function cancelBooking(req, res) {
  try {
    const { id } = req.params;
    await db.execute("UPDATE bookings SET status = 'cancelled' WHERE id = ?", [
      id,
    ]);
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getBookings,
  createBooking,
  cancelBooking,
};
