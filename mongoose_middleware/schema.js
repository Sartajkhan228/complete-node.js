import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, default: 0, required: true },
    color: { type: [String], default: [] },

}, { timestamps: true });

const User = new model("User", usersSchema)

export default User;