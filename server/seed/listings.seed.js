require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/Listing.model");

const seedListings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Listing.deleteMany();

    await Listing.insertMany([
      {
        title: "BMW X5 2022",
        images: ["https://dummyimage.com/600x400/000/fff"],
        price: 4500000,
        category: "car",
        location: "Delhi",
        dealer: {
          name: "Otulia Motors",
          phone: "+91XXXXXXXXXX",
        },
        isFeatured: true,
        views: 120,
        bookings: 5,
        acquisition: 'buy',
      },
      {
        title: "Lamborghini Urus",
        images: ["https://dummyimage.com/600x400/111/fff"],
        price: 12000000,
        category: "car",
        location: "Mumbai",
        dealer: {
          name: "Elite Autos",
        },
        views: 300,
        bookings: 12,
        acquisition: 'buy',
      },
      {
        title: "Luxury Beach Villa",
        images: ["https://dummyimage.com/600x400/222/fff"],
        price: 250000,
        category: "estate",
        location: "Goa",
        dealer: {
          name: "Otulia Estates",
        },
        isFeatured: true,
        views: 180,
        bookings: 9,
        acquisition: 'rent',
      },
    ]);

    // Listings seeded successfully
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedListings();
