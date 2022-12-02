import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
   description: {type: String, required: true},
   photo: {type: String, required: true},
   idUser: {type: String, required: true},
   data: {type: String, required: true}
});

export const postModel = (mongoose.models.post || mongoose.model('post', postSchema));
