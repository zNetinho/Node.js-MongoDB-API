import { userModel } from './../../models/userModels';
import { postModel } from './../../models/postModels';
import type { NextApiRequest, NextApiResponse } from "next";
import { conectMongoDB } from '../../middlewares/conectionDB'
import { msgPadrao } from '../../types/msgPadrao';
import { JWTvalidator } from '../../middlewares/validatorJWT';

const likeEndpoint = async (req: NextApiRequest, res: NextApiResponse<msgPadrao>) =>{
    try {
        if(req.method === 'PUT') {
            console.log('entrou no endpoint')
            const  { id } = req?.query
            const post = await postModel.findById(id);
            if(!post) {
               return res.status(400).json({error: 'Post no exist'})
            }
            console.log(post)

            const { userId } = req?.query;
            const user = await userModel.findById(userId)
            if(!user) {
               return res.status(400).json({error: 'user no exist'})
            }
            console.log(user)

            const userIndexLiked = post.likes.findIndex((e: any) => e.toString() === user._id.toString())
            
            if(userIndexLiked != -1) {
                post.likes.splice(userIndexLiked, 1)
                await postModel.findByIdAndUpdate({_id: post._id}, post)
                return res.status(200).json({msg: 'Post deslike'})
            }else {
                post.likes.push(user._id)
                await postModel.findByIdAndUpdate({_id: post._id}, post)
                return res.status(200).json({msg: 'Liked post'})
            }
        }
        return res.status(405).json({error: 'method not allowed'})

    } catch (error) {
        console.log(error)
    }
};

export default JWTvalidator(conectMongoDB(likeEndpoint));