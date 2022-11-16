
import type { NextApiRequest, NextApiResponse } from "next";
import { conectMongoDB } from "../../middlewares/conectionDB";
import { msgPadrao } from '../../types/msgPadrao'

const endPointLogin = (
    req: NextApiRequest,
    res: NextApiResponse<msgPadrao>
) => {
    if (req.method === 'POST') {
        const {login, senha} = req.body;
          
        if (login === 'admin@123' && senha === 'admin') {
           return res.status(200).json({msg:'Bem-vindo'});
        }
        return res.status(405).json({ error: 'User already exist' })
    }
    return res.status(400).json({ error: 'Method not allowed' })
}

// export default conectMongoDB