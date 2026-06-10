import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, "Name is required" ],
    },
    username: {
        type: String,
        unique: [ true, "username already taken" ],
        required: true,
    },
    email: {
        type: String,
        unique: [ true, "Account already exists with this email address" ],
        required: true,
    },
    password: {
        type: String,
        required: true
    }
});

const userModel = mongoose.model("users", userSchema);

export default userModel;