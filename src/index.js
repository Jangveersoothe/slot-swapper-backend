const express = require("express");
const app = express();
const sequelize = require("./db");
const User = require("./models/User");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("SlotSwapper backend running");
});

sequelize.sync().then(() => {
  console.log("Database synced");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on localhost: ${PORT}`);
});
