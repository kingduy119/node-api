import mongoose from "mongoose";

const schema = new mongoose.Schema({
    slug: { type: String, require: true, unique: true },
    value: { type: String, require: true }
});

module.exports = mongoose.model("Category", schema);