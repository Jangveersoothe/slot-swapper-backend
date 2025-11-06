const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");

const Slot = sequelize.define("Slot", {
  title: { type: DataTypes.STRING, allowNull: false },
  startTime: { type: DataTypes.DATE, allowNull: false },
  endTime: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM("BUSY", "SWAPPABLE", "SWAP_PENDING"),
    defaultValue: "BUSY",
  },
});

User.hasMany(Slot);
Slot.belongsTo(User);

module.exports = Slot;
