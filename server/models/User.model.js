const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: false,
      minlength: 6,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user",
    },

    profilePicture: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },

    phone: {
      type: String,
    },

    plan: {
      type: String,
      enum: ["Freemium", "Premium Basic", "Business VIP"],
      default: "Freemium",
    },

    planExpiresAt: {
      type: Date,
    },

    favorites: [
      {
        assetId: { type: mongoose.Schema.Types.ObjectId, refPath: "favorites.assetModel" },
        assetModel: { type: String, enum: ["CarAsset", "EstateAsset", "YachtAsset", "BikeAsset"] },
        addedAt: { type: Date, default: Date.now }
      }
    ],

    myListings: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, refPath: "myListings.itemModel" },
        itemModel: { type: String, enum: ["Listing", "CarAsset", "EstateAsset", "YachtAsset", "BikeAsset"], default: "Listing" }
      }
    ],

    boughtHistory: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, refPath: "boughtHistory.itemModel" },
        itemModel: { type: String, enum: ["Listing", "CarAsset", "EstateAsset", "YachtAsset", "BikeAsset"], default: "Listing" },
        date: { type: Date, default: Date.now },
        price: Number,
        orderId: String
      }
    ],

    rentedHistory: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, refPath: "rentedHistory.itemModel" },
        itemModel: { type: String, enum: ["Listing", "CarAsset", "EstateAsset", "YachtAsset", "BikeAsset"], default: "Listing" },
        startDate: Date,
        endDate: Date,
        totalPrice: Number, // Changed from price to totalPrice for clarity
        orderId: String,
        rentedAt: { type: Date, default: Date.now }
      }
    ],

    soldHistory: [
      {
        listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
        date: { type: Date, default: Date.now },
        amount: Number,
        buyerEmail: String
      }
    ],

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
