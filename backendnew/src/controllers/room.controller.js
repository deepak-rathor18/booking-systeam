const db = require("../cofing/db");

async function getRooms(req, res) {
  try {
    const [rows] = await db.execute("SELECT * FROM rooms order by floor,name");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getRooms,
};
