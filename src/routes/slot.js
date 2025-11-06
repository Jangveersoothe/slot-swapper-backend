const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");
const SwapRequest = require("../models/SwapRequest");
const { Op } = require("sequelize");

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

//get all swappable slots from other users
router.get("/available", authMiddleware, async (req, res) => {
  const slots = await Slot.findAll({
    where: {
      status: "SWAPPABLE",
      UserId: { [require("sequelize").Op.ne]: req.user.userId },
    },
  });
  res.json(slots);
});

router.post("/request-swap/:slotId", authMiddleware, async (req, res) => {
  const slot = await Slot.findOne({ where: { id: req.params.slotId } });

  if (!slot) return res.status(404).json({ error: "Slot not found" });
  if (slot.UserId === req.user.userId)
    return res.status(400).json({ error: "You cannot request your own slot" });
  if (slot.status !== "SWAPPABLE")
    return res.status(400).json({ error: "Slot is not swappable" });

  const request = await SwapRequest.create({
    RequesterId: req.user.userId,
    RequestedId: slot.UserId,
    RequestedSlotId: slot.id,
  });

  res.json({ message: "Swap request sent", request });
});

router.get("/swap-requests", authMiddleware, async (req, res) => {
  const requests = await SwapRequest.findAll({
    include: [
      {
        model: Slot,
        as: "RequestedSlot",
        where: { UserId: req.user.userId }, // Only show requests for MY slots
      },
      {
        model: User,
        as: "Requester", // The user who sent the request
        attributes: ["id", "email"],
      },
    ],
  });

  res.json(requests);
});

router.put("/swap-approve/:requestId", authMiddleware, async (req, res) => {
  const request = await SwapRequest.findOne({
    where: { id: req.params.requestId, status: "PENDING" },
    include: [{ model: Slot, as: "RequestedSlot" }],
  });

  if (!request) return res.status(404).json({ error: "Request not found" });
  if (request.RequestedSlot.UserId !== req.user.userId)
    return res.status(403).json({ error: "Not authorized" });

  // Transfer slot to requester
  request.RequestedSlot.UserId = request.RequesterId;
  await request.RequestedSlot.save();

  request.status = "APPROVED";
  await request.save();

  res.json({ message: "Swap approved", request });
});

module.exports = router;
