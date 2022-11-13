const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Room = new Schema(
  {
    member_1: { type: mongoose.Types.ObjectId, require: true },
    member_2: { type: mongoose.Types.ObjectId, require: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", Room);
