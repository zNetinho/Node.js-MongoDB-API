
import type { NextApiRequest, NextApiResponse } from "next";

export default (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if (req.method === 'POST') {
        const {login, senha} = req.body;
          
        if (login === 'admin@123' && senha === 'admin') {
            res.status(200).json({msg:'Bem-vindo'});
        }
        return res.status(405).json({ error: 'usuario incorreto' })
    }
    return res.status(400).json({ error: 'Method not allowed' })
}