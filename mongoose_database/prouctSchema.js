import mongoose from "mongoose";

const pruductSchema = new mongoose.Schema({
    name: String, required: true,
    email: String, required: true,
    age: Number, default: 0, required: true,
    color: [String], default: []

}, { timestamp: true })

const Products = mongoose.model("Products", pruductSchema);

export default Products
