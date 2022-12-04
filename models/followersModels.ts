import mongoose, { Schema } from "mongoose";

const followerSchema = new Schema({
    //quem segue voce
    userIdfolloweds: {type: String, required: true},
    //quem você segue
    userIdfollowers: {type: String, required: true},
});

export const followingModel = (mongoose.models.followers || mongoose.model('followers', followerSchema))