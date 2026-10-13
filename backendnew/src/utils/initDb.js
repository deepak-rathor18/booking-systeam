const db = require("../cofing/db");

async function initDB() {
  await db.execute(`CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    floor INT NOT NULL,
    amenities VARCHAR(255) DEFAULT ""
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,   
    title VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    attendees INT NOT NULL, 
    start DATETIME NOT NULL,
    end DATETIME NOT NULL,
    status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    INDEX booking_lookup (room_id, start, end)
  )`);

  const rooms = [
    ["Atlas", 4, 1, "Monitor"],
    ["Borealis", 8, 1, "projector, Whiteboard"],
    ["Cascade", 12, 2, "projector, Video Conferencing"],
    ["Delta", 20, 3, "projector, Whiteboard, Video Conferencing"],
    ["Ember", 2, 2, "projector"],
  ];

  for (const room of rooms) {
    await db.query(
      "INSERT IGNORE INTO rooms (name, capacity, floor, amenities) VALUES (?, ?, ?, ?)",
      room,
    );
  }
  console.log("Database initialized successfully");
}



module.exports = initDB;
