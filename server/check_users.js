const mongoose = require("mongoose");
const User = require("./models/User.model");
require("dotenv").config();

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const users = await User.find({ name: { $regex: "Sudeep", $options: "i" } });
    console.log("Users found:", users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role })));

    const specific = await User.findOne({ email: "tsudeepreddy04@gmail.com" });
    if (specific) {
        console.log("Found user with target email:", { id: specific._id, name: specific.name, email: specific.email });
    } else {
        console.log("No user found with email: tsudeepreddy04@gmail.com");
    }

    process.exit();
};

run();
