import type { NextApiRequest, NextApiResponse } from "next";
import { userModel } from './../../models/userModels';
import { conectMongoDB } from '../../middlewares/conectionDB'
import { msgPadrao } from '../../types/msgPadrao';
import { JWTvalidator } from '../../middlewares/validatorJWT';
import { corsRules } from "../../middlewares/corsRules";

const searchPoint = async (req: NextApiRequest, res: NextApiResponse<msgPadrao | any[]>) => {
    try {
        if (req?.method === 'GET') {
            if (req?.query?.id) {
                const userFind = await userModel.findById(req?.query?.id)
                userFind.password = null;
                if (!userFind) {
                    return res.status(400).json({ error: 'user not find' })
                }
                console.log(userFind)
                return res.status(200).json(userFind)
            } else {
                const { nameFind } = req?.query;
                if (!nameFind || nameFind.length < 2) {
                    return res.status(400).json({ error: 'please input text search' })
                }
                const usersFindings = await userModel.find({
                    name: { $regex: nameFind, $options: 'i' }
                })
                return res.status(200).json(usersFindings)
            }
        }
        return res.status(400).json({ error: 'method not allowed' })

    } catch (error) {
        console.log(error)
    }
};

export default corsRules(JWTvalidator(conectMongoDB(searchPoint)));