import mongoose from "mongoose";

const schema = new mongoose.Schema({
    provider: { type: String, default: "local"},
    createAt: { type: Date, default: Date.now() },
    username: { type: String, required: true, unique: true },
    password: { type: String, require: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    displayName: { type: String, default: '' },
    email: { type: String, default: ''},
    avatarUrl: { type: String, default: ''},
    accessToken: { type: String, default: ''},
    role: { type: String, default: 'guest' },
    // isGithubConnected: { type: Boolean, default: false, },
    // githubAccessToken: { type: String, },

    // Feautures:
    // posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    // notifications: {type: mongoose.Types.ObjectId,ref: 'Notification'}
});

module.exports = mongoose.model("User", schema);