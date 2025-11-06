const express = require("express");
const cors = require("cors"); // <--- add this
const app = express();
const sequelize = require("./db");
const User = require("./models/User");
const SwapRequest = require("./models/SwapRequest");

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // <--- add this
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const slotRoutes = require("./routes/slot");
app.use("/api/slot", slotRoutes);

sequelize.sync().then(() => {
  console.log("Database synced");
});

app.get("/", (req, res) => {
  res.json({ message: "Backend is connected ✅" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on localhost: ${PORT}`);
});
