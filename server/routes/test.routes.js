const express = require("express");
const YachtAsset = require("../models/YachtAsset.model");
const router = express.Router();
router.get("/", async (req, res) => {
    const data = await YachtAsset.find();
    res.json(data);
});
module.exports = router;
