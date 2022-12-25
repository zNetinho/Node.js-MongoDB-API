import { postModel } from './../../models/postModels';
import { NextApiRequest } from 'next';
import { userModel } from './../../models/userModels';
import { NextApiResponse } from 'next';
import { msgPadrao } from '../../types/msgPadrao';
import { conectMongoDB } from '../../middlewares/conectionDB';
import { JWTvalidator } from '../../middlewares/validatorJWT';
import { corsRules } from '../../middlewares/corsRules';

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
    } catch (error) {
        console.log(error)
    }
    return res.status(400).json({ error: 'not possible obtain feed' })
}

export default corsRules(JWTvalidator(conectMongoDB(feedsUser)))