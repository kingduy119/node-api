import mongoose from "mongoose";

const schema = new mongoose.Schema({
    createAt: { type: Date, default: Date.now() },
    updateAt: { type: Date, default: Date.now() },
    title: { type: String, require: true },
    description: { type: String, default: ''},
    cost: { type: Number, default: 0, min: 0},
    total: { type: Number, default: 0, min: 0},
    author: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'User',
    },
    categories: [{
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    }]
});

module.exports = mongoose.model("Product", schema);