const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: String,
  location: String,
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider" }
});

module.exports = mongoose.model("Service", serviceSchema);
