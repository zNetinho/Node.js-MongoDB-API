import { NextApiRequest } from 'next';
import { userModel } from './../../models/userModels';
import { NextApiResponse } from 'next';
import { msgPadrao } from '../../types/msgPadrao';
import { conectMongoDB } from '../../middlewares/conectionDB';
import { JWTvalidator } from '../../middlewares/validatorJWT';
import nc from 'next-connect';
import { upload, uploadImageCosmic } from '../../services/uploadImageCosmic';
import { corsRules } from '../../middlewares/corsRules';

const handler = nc()
    .use(upload.single('file'))
    .put(async (req: any, res: NextApiResponse<msgPadrao>) => {
        try {
            const { userId } = req?.query;
            const user = await userModel.findById(userId);

            console.log(user)
            console.log(userId)

            if(!user) {
                return res.status(400).json({error: 'User not find'})
            }
            const { name } = req.body;
            if(name && name.length > 2) { 
                user.name = name;
            }
            const {file} = req.body;
            if(file && file.originalname) {
                const image = await uploadImageCosmic(req);
                if(image && image.media.url) {
                    user.file = image.media.url;
                }
            }

            await userModel.findByIdAndUpdate({_id: user._id}, user)
            console.log('Novo objeto', user)
            return res.status(200).json({msg: 'Tudo certo'})
                
            } catch (e) {
            console.log(e);
        }
        return res.status(400).json({error: 'Not possible update data user'})
    })
    .get( async (req: NextApiRequest, res: NextApiResponse<msgPadrao | any>) => {
            try {
                const { userId } = req?.query;
                const user = await userModel.findById(userId);
                user.password = null;
                return res.status(200).json(user)
            } catch (error) {
                console.log(error)
                return res.status(400).json({ error: 'Not possible obtain data user' })
            }
        }
    )

    export const config = {
        api: {
            bodyParser: false
        }
    }

export default corsRules(JWTvalidator(conectMongoDB(handler)));