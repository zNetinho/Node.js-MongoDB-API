import { userModel } from './../../models/userModels';
import type { NextApiRequest, NextApiResponse } from "next";
import { conectMongoDB } from "../../middlewares/conectionDB";
import { msgPadrao } from '../../types/msgPadrao'
import md5 from 'md5';


const login = async (
    req: NextApiRequest,
    res: NextApiResponse<msgPadrao>
) => {
    if (req.method === 'POST') {
        const {email, password} = req.body;

        const usersFind = await userModel.find({email: email, password: md5(password)})
        if (usersFind && usersFind.length > 0) {
            const userFind = usersFind[0];
            return res.status(200).json({ msg: `Seja bem vindo, ${userFind.name}` });
        }
        return res.status(405).json({ error: 'User not exist' });
    } 
    return res.status(400).json({ error: 'Method not allowed' });
}
export default conectMongoDB(login);
