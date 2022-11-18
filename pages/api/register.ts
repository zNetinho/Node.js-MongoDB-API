import type { NextApiRequest, NextApiResponse } from "next";
import { conectMongoDB } from '../../middlewares/conectionDB'
import { msgPadrao } from '../../types/msgPadrao';
import { registerUser } from '../../types/registerRequest';
import { userModel } from '../../models/userModels';
import md5 from 'md5';

const createUser = 
  async (req: NextApiRequest, res:NextApiResponse<msgPadrao>) => {

    if (req.method === 'POST') {
        const user = req.body as registerUser;
        
        if(!user.name || user.name.length < 2) {
            return res.status(400).json({error: 'Nome invalido'})
        }
        if(!user.email || user.email.length < 5
            || !user.email.includes('@')
            || !user.email.includes('.')){
                return res.status(400).json({error:'email incorreto'})
            }
        if(!user.password || user.password.length < 6) {
            return res.status(400).json({error: 'senha invalida'})
        }

        const userEmailDuplicate = await userModel.find({email : user.email}) 
            if(userEmailDuplicate && userEmailDuplicate.length > 0) {
                return res.status(400).json({ error: 'email already exist'})
            }

        const userToSave = {
            name: user.name,
            email: user.email,
            password: md5(user.password)
        }

        await userModel.create(userToSave)
        return res.status(200).json({msg: "Tudo ok"})
    }
    return res.status(405).json({error: 'method not allowed'})
 } 
export default conectMongoDB(createUser);