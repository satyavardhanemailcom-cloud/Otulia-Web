const mongoose = require("mongoose");
const User = require("./models/User.model");
require("dotenv").config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 1. Identify the accounts
        const realEmail = "tsudeepreddy04@gmail.com";
        const typoEmail = "sudeepreddyt04@gmail.com";

        const adminUser = await User.findOne({ email: realEmail });
        const partnerUser = await User.findOne({ email: typoEmail });

        if (!adminUser || !partnerUser) {
            console.log("One of the users not found. Aborting.");
            // If admin is not found, maybe it was already renamed?
            if (partnerUser && !adminUser) {
                console.log("Only partner found. Updating partner email directly.");
                partnerUser.email = realEmail;
                await partnerUser.save();
                console.log("Partner email updated to", realEmail);
            }
            process.exit();
            return;
        }

        console.log(`Found Admin: ${adminUser.email} (${adminUser._id})`);
        console.log(`Found Partner: ${partnerUser.email} (${partnerUser._id})`);

        // 2. Rename Admin to free up the email
        // We append a random string to ensure uniqueness and backup
        const backupEmail = `admin_backup_${Date.now()}@otulia.com`;
        adminUser.email = backupEmail;
        await adminUser.save();
        console.log(`Renamed Admin to: ${backupEmail}`);

        // 3. Rename Partner to the correct email
        partnerUser.email = realEmail;
        // Ensure name is correct too if needed
        partnerUser.name = "Sudeep Reddy";
        await partnerUser.save();
        console.log(`Renamed Partner to: ${realEmail}`);

        console.log("SUCCESS: Emails fixed.");

    } catch (e) {
        console.error("Error:", e);
    } finally {
        process.exit();
    }
};

run();
