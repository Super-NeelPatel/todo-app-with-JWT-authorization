const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const Tasks = require("../model/taskModel")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    tasks: [Tasks]
})


userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();  // Only hash if modified
    if (!this.password) return next(new Error("Password is required"));  // Optional but helpful
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model("User", userSchema)