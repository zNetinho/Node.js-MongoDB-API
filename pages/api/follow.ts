import { userModel } from './../../models/userModels';
import { NextApiRequest, NextApiResponse } from "next";
import { msgPadrao } from "../../types/msgPadrao";
import { JWTvalidator } from "../../middlewares/validatorJWT";
import { conectMongoDB } from "../../middlewares/conectionDB";
import { followingModel } from '../../models/followersModels';

const endpointFollow = async (req: NextApiRequest, res: NextApiResponse<msgPadrao>) => {
    try {
        if (req.method === 'PUT') {

            const { userId, id } = req?.query;
            const userLogged = await userModel.findById(userId)
            if (!userLogged) {
                return res.status(400).json({ error: 'logged in user not found' });
            }
            const userFollowed = await userModel.findById(id);
            if (!id) {
                return res.status(400).json({ error: 'user to be followed not found' });
            }
            const iFollowYou = await followingModel
                .find({ userIdfolloweds: userLogged._id, userIdfollowers: userFollowed._id })
            if (iFollowYou && iFollowYou.length > 0) {
                iFollowYou.forEach(async (e: any) => await followingModel.findByIdAndDelete({ _id: e._id }))
                {
                    userLogged.followers--;
                    await userModel.findByIdAndUpdate({ _id: userLogged._id }, userLogged)
                    userFollowed.followers--;
                    await userModel.findByIdAndUpdate({ _id: userFollowed._id }, userFollowed)

                    return res.status(200).json({ msg: 'Stop following' })
                }
            } else {
                const follower = {
                    userIdfolloweds: userLogged._id,
                    userIdfollowers: userFollowed._id
                };
                await followingModel.create(follower);
                userLogged.following++
                await userModel.findByIdAndUpdate({ _id: userLogged._id }, userLogged)
                userFollowed.followers++
                await userModel.findByIdAndUpdate({ _id: userFollowed._id }, userFollowed)
                return res.status(203).json({ msg: 'Adiciona um usuario no seguindo do usuario logado' })
            }

        }
        return res.status(405).json({ error: 'method not allowed' })
    } catch (e) {
        console.log(e, 'Deu algum erro na api resolva')
    }
}

export default JWTvalidator(conectMongoDB(endpointFollow));