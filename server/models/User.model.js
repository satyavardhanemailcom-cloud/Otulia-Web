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

    profilePicturePublicId: {
      type: String,
    },

    coverPhoto: String,
    coverPhotoPublicId: String,

    phone: {
      type: String,
    },

    whatsapp: String,
    jobTitle: String,
    language: String,
    timezone: String,
    preferredContact: String,
    agentDescription: String,
    social: {
      instagram: String,
      linkedin: String,
      facebook: String,
      twitter: String,
      youtube: String
    },

    company: {
      companyName: String,
      companyLogo: String,
      companyLogoPublicId: String,
      coverPhoto: String,
      coverPhotoPublicId: String,
      address: String,
      website: String,
      description: String,
      businessType: String,
      establishedYear: String,
      phone: String,
      email: String,
      social: {
        instagram: String,
        linkedin: String,
        facebook: String,
        twitter: String,
        youtube: String
      }
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected", "None"],
      default: "None",
    },

    verificationDocuments: {
      type: Map,
      of: String // Document type -> URL
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
        assetModel: { type: String, enum: ["Listing", "CarAsset", "EstateAsset", "YachtAsset", "BikeAsset"] },
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

    notifications: [
      {
        type: { type: String, default: "LEAD" },
        message: String,
        targetTab: String,
        assetId: mongoose.Schema.Types.ObjectId,
        assetTitle: String,
        assetModel: String,
        leadId: mongoose.Schema.Types.ObjectId,
        createdAt: { type: Date, default: Date.now }
      }
    ],

    leadEmailNotifications: {
      type: Boolean,
      default: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
