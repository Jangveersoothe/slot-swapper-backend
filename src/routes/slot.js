const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");
const authMiddleware = require("../middleware/auth");

//Create Slot
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({ error: "All fields required" });
    }

    const userId = req.user.userId;

    const slot = await Slot.create({
      title,
      startTime,
      endTime,
      UserId: userId,
    });

    res.json(slot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/mine", authMiddleware, async (req, res) => {
  const slots = await Slot.findAll({
    where: { UserId: req.user.userId },
  });

  res.json(slots);
});

//Mark slot as swappable
router.put("/make-swappable/:id", authMiddleware, async (req, res) => {
  const slot = await Slot.findOne({
    where: { id: req.params.id, UserId: req.user.userId },
  });

  if (!slot) return res.status(404).json({ error: "Slot not found" });

  slot.status = "SWAPPABLE";
  await slot.save();

  res.json({ message: "Slot set to SWAPPABLE", slot });
});

module.exports = router;
