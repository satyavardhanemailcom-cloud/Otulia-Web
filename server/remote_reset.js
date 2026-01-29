
const mongoose = require("mongoose");
const User = require("./models/User.model");
require("dotenv").config({ path: "./server/.env" }); // Explicit path to .env since we are running from root

const resetVerification = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is missing from environment. Using manual string as fallback or checking .env load.");
            // Hardcoded fallback for script execution context only if dotenv fails
            await mongoose.connect('mongodb+srv://otulia_admin:6KWLJGoNGKwEubE6@otulia-cluster.m3pbjxj.mongodb.net/otulia?retryWrites=true&w=majority');
        } else {
            await mongoose.connect(process.env.MONGO_URI);
        }

        console.log("Connected to MongoDB");

        const users = await User.find({}, "name email verificationStatus");
        console.log("Current Users:");
        users.forEach(u => console.log(`- ${u.name} (${u.email}): ${u.verificationStatus}`));

        // AUTO-RESET: Find "Sudeep Reddy" or the admin user and reset validation
        const targetUser = await User.findOne({ email: /reddy/i });

        if (targetUser) {
            console.log(`Found User: ${targetUser.name} (${targetUser.email}). Resetting Verification Status...`);
            targetUser.verificationStatus = "None"; // Or "Rejected" if explicitly testing rejection flow
            targetUser.isVerified = false;
            // Clear documents to ensure fresh upload test
            targetUser.verificationDocuments = {};

            await targetUser.save();
            console.log("Verification Status RESET to 'None'. Uploads cleared.");
        } else {
            console.log("Target user 'Sudeep' not found. Please manually specify email in script.");
        }

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

resetVerification();
