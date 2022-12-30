import { postModel } from './../../models/postModels';
import { NextApiRequest } from 'next';
import { userModel } from './../../models/userModels';
import { NextApiResponse } from 'next';
import { msgPadrao } from '../../types/msgPadrao';
import { conectMongoDB } from '../../middlewares/conectionDB';
import { JWTvalidator } from '../../middlewares/validatorJWT';
import { corsRules } from '../../middlewares/corsRules';
import { followingModel } from './../../models/followersModels';

const feedsUser = async (req: NextApiRequest, res: NextApiResponse<msgPadrao | any>) => {
    try {
        if (req.method === 'GET') {
            if (req?.query?.id) {
                const user = await userModel.findById(req?.query?.id);
                if (!user) {
                    return res.status(400).json({ error: 'user not exist' });
                }
                const posts = await postModel
                    .find({ idUser: user._id })
                    .sort({ data: -1 })
                return res.status(200).json(posts)
            }    
            
        }
        else {
            const userId = req?.query;
            const userLogged = await userModel.findById(userId)
            if(!userLogged) {
                return res.status(400).json({ error: 'User not find'})
            }

            const followers = await followingModel.find({userId: userLogged._id});
            const followersId = followers.map(s => s.userIdfolloweds);

            const posts = await postModel.find({
                $or: [
                    {userId: userLogged._id},
                    {userId: followersId}
                ]
            })
            .sort({data: -1})

            const result = [];
            for(const post of posts) {
                const userPost = await postModel.findById(post.userId)
                if(userPost){
                    const final = {...post._doc, user : {
                        name: userPost?.name,
                        avatar: userPost?.avatar
                    }};
                    result.push(final)
                }
            }
            return res.status(200).json(result)
        }
        return res.status(405).json({error: 'Method not allowed'})

    } catch (error) {
        console.log(error)
    }
    return res.status(400).json({ error: 'not possible obtain feed' })
}

export default corsRules(JWTvalidator(conectMongoDB(feedsUser)))