const mongoose = require("mongoose")

const passwordResetSchema = new mongoose.Schema({
    resetKey: {
        type: String,
        required: true
    },
    selectedUser: {
        type: String,
        required: true
    }
})

module.exports = {passwordResetSchema: mongoose.model("passwordReset", passwordResetSchema)}