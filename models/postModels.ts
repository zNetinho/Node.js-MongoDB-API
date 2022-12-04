import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
   idUser: {type: String, required: true},
   description: {type: String, required: true},
   photo: {type: String, required: true},
   data: {type: String, required: true},
   comments: {type: Array, required: true, default:[]},
   likes: {type: Array, required: true, default:[]}
});

export const postModel = (mongoose.models.post || mongoose.model('post', postSchema));
