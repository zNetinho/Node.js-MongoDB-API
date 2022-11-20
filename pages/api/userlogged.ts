import { msgPadrao } from '../../types/msgPadrao';
import { NextApiRequest, NextApiResponse } from "next";
import { JWTvalidator } from '../../middlewares/validatorJWT' 

const userLogged = (req: NextApiRequest, res: NextApiResponse<msgPadrao>) => {
    return res.status(200).json({msg: 'Autenticado concerteza'})
}

export default JWTvalidator(userLogged);