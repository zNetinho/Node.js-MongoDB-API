import { userModel } from './../../models/userModels';
import type { NextApiRequest, NextApiResponse } from "next";
import { conectMongoDB } from "../../middlewares/conectionDB";
import { msgPadrao } from '../../types/msgPadrao'
import { loginResponse } from '../../types/loginToken'
import md5 from 'md5';
import jwt from 'jsonwebtoken';


const login = async (
    req: NextApiRequest,
    res: NextApiResponse<msgPadrao | loginResponse>
) => {

    const {MINHA_CHAVE_JWT} = process.env;
    if(!MINHA_CHAVE_JWT) {
        return res.status(500).json({error: 'Error of variavel'})
        }

    if (req.method === 'POST') {
        const {email, password} = req.body;

        const usersFind = await userModel.find({email: email, password: md5(password)})
        if (usersFind && usersFind.length > 0) {
            const userFind = usersFind[0];

            const token = jwt.sign({_id: userFind._id}, MINHA_CHAVE_JWT)

            return res.status(200).json({
                name: userFind.name,
                email: userFind.email,
                token});
        }
        return res.status(405).json({ error: 'User not exist' });
    } 
    return res.status(400).json({ error: 'Method not allowed' });
}
export default conectMongoDB(login);
