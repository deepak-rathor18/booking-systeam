const express = require("express");
const cors = require("cors");

// const roomRoutes = require("./routes/room.routes");
// const bookingRoutes = require("./routes/booking.routes");
// const availabilityRoutes = require("./routes/availibility.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Booking System API");
});

// app.use("/api/rooms", roomRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/availability", availabilityRoutes);   

module.exports = app;