const mongoose = require("mongoose");

const documentChildSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
});
const documentSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, required: false },
  children: {
    type: [documentChildSchema],
    required: false,
  },
});

module.exports = mongoose.model("Document", documentSchema);
