
const mongoose = require("mongoose");
const User = require("./models/User.model");
require("dotenv").config({ path: "./server/.env" });

const resetVerification = async () => {
    try {
        if (!process.env.MONGO_URI) {
            await mongoose.connect('mongodb+srv://otulia_admin:6KWLJGoNGKwEubE6@otulia-cluster.m3pbjxj.mongodb.net/otulia?retryWrites=true&w=majority');
        } else {
            await mongoose.connect(process.env.MONGO_URI);
        }

        console.log("Connected to MongoDB");

        // Update ALL users that are Pending or Rejected back to None
        const result = await User.updateMany(
            { verificationStatus: { $in: ['Pending', 'Rejected'] } },
            {
                $set: {
                    verificationStatus: 'None',
                    isVerified: false,
                    verificationDocuments: {}
                }
            }
        );

        console.log(`Reset ${result.modifiedCount} users to 'None' status.`);

        // Log the new states to confirm
        const users = await User.find({}, "name email verificationStatus");
        users.forEach(u => console.log(`- ${u.name} (${u.email}): ${u.verificationStatus}`));

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

resetVerification();
