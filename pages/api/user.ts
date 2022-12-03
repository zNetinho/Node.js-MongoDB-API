import { NextApiRequest } from 'next';
import { userModel } from './../../models/userModels';
import { NextApiResponse } from 'next';
import { msgPadrao } from '../../types/msgPadrao';
import { conectMongoDB } from '../../middlewares/conectionDB';
import { JWTvalidator } from '../../middlewares/validatorJWT';

const user = async (req: NextApiRequest, res: NextApiResponse<msgPadrao | any>) => {
        try {
            const { userId } = req?.query;
            const user = await userModel.findById(userId);
            user.password = null;
            return res.status(200).json(user)
        } catch (error) {  
            console.log(error)
            return res.status(400).json({error: 'Not possible obtain data user'})
        }
}

export default JWTvalidator(conectMongoDB( user ));