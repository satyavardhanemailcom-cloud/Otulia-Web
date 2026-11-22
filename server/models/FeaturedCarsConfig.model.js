const mongoose = require("mongoose");

const featuredCarsConfigSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "cars-category" },
    carIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "CarAsset" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("FeaturedCarsConfig", featuredCarsConfigSchema);
