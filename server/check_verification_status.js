
const mongoose = require("mongoose");
const User = require("./models/User.model");
require("dotenv").config();

const resetVerification = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const users = await User.find({}, "name email verificationStatus");
        console.log("Current Users:");
        users.forEach(u => console.log(`- ${u.name} (${u.email}): ${u.verificationStatus}`));

        // Reset for the likely user (checking for commonly used emails in this session)
        // I will reset ALL users to 'None' for testing purposes if requested, or just the specific one.
        // Given the request "change this back", I'll reset the specific user if found, or ask.

        // For now, let's just list them to identify who to reset.

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

resetVerification();
