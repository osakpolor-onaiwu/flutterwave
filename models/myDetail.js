const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model(
    "UserDetails",
    Schema({
        name: { type: String, required: true },
        github: { type: String, required: true },
        email: { type: String, required: true },
        mobile: { type: String, required: true },
    })
);
