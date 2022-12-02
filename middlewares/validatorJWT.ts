import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import { msgPadrao } from '../types/msgPadrao'


export const JWTvalidator = (handler: NextApiHandler) => 
    async (req: NextApiRequest, res: NextApiResponse<msgPadrao>) => {

        const { MINHA_CHAVE_JWT } = process.env;
        if (!MINHA_CHAVE_JWT) {
            return res.status(500).json({ error: 'Error in JWT token' })
        }

        if (!req || !req.headers) {
            return res.status(401).json({ error: 'Token invalid' })
        }

        if (req.method !== 'OPTIONS') {
            const authorization = req.headers['authorization'];
            if (!authorization) {
                return res.status(401).json({ error: 'Not possible validation token' })
            }
            const token = authorization.substring(7);
            if (!token) {
                return res.status(401).json({ error: 'Not possible validation token' })
            }
            const decoded = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;
            if (!decoded) {
                return res.status(401).json({ error: 'Not possible validation token' })
            }

            if(!req.query) {
                req.query = {};
            }

            req.query.userId = decoded._id
        }

        return handler(req, res);
    }
