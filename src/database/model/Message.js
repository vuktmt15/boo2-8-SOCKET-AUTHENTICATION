const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Message = new Schema(
  {
    sender: { type: mongoose.Types.ObjectId, require: true },
    receiver: { type: mongoose.Types.ObjectId, require: true },
    content: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", Message);
