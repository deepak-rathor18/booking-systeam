
const db = require("../cofing/db");

async function getAvailability(req, res) {
            const {start, end,capacity} = req.query;
        if (!start || !end) {
            return res.status(400).json({ error: "Start and end date are required" });
        }
    try {

        const [rooms] = await db.execute(
            `SELECT * FROM rooms WHERE capacity >= ? AND id NOT IN (
                SELECT room_id FROM bookings    
                WHERE status = 'confirmed' AND (
                    (start < ? AND end > ?) OR 
                    (start < ? AND end > ?) OR
                    (start >= ? AND end <= ?)
                )
            )`,
            [capacity, end, start, end, start, start, end]
        );  
        res.json(rooms);
    } catch (error) {
        console.error("Error fetching availability:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getAvailability,
};