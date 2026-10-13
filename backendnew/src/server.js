require("dotenv").config();

const app = require("./app");
const initDB = require("./utils/initDb");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
