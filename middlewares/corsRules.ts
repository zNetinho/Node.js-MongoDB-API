import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { msgPadrao } from '../types/msgPadrao';
import NextCors from "nextjs-cors";

export const corsRules = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse<msgPadrao>) => {
    try {
        await NextCors(req, res, {
            origin: '*',
            methods: ['GET', 'POST', 'PUT'],
            optionsSuccessStatus: 200,  
        });

        return handler(req, res);

    } catch (e) {
        console.log('error de cors')
        res.status(500).json({error: 'error no cors'})
    }
}