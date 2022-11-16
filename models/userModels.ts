import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    followers: { type: Number, default: 0},
    following: { type: Number, default: 0},
    publication: { type: Number, default: 0},
});

export const userModel = (mongoose.models.user || mongoose.model('usuarios', userSchema));
