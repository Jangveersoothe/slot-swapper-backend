const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const Slot = require("./Slot");

const SwapRequest = sequelize.define("SwapRequest", {
  status: {
    type: DataTypes.STRING,
    defaultValue: "PENDING",
  },
});
// The user who REQUESTS the swap
SwapRequest.belongsTo(User, { as: "Requester", foreignKey: "RequesterId" });

// The user who OWNS the requested slot
SwapRequest.belongsTo(User, { as: "Requested", foreignKey: "RequestedId" });

// The slot being requested
SwapRequest.belongsTo(Slot, {
  as: "RequestedSlot",
  foreignKey: "RequestedSlotId",
});

module.exports = SwapRequest;
