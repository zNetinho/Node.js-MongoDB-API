import { userModel } from './../../models/userModels';
import { NextApiResponse } from 'next';
import { msgPadrao } from '../../types/msgPadrao';
import { postModel } from '../../models/postModels'
import nc from 'next-connect';
import { upload, uploadImageCosmic } from '../../services/uploadImageCosmic';
import { conectMongoDB } from '../../middlewares/conectionDB';
import { JWTvalidator } from '../../middlewares/validatorJWT';


const handler = nc()
    .use(upload.single('file'))
    .post(async (req: any, res: NextApiResponse<msgPadrao>) => {
        try {
            const {userId} = req.query;
            const user = await userModel.findById(userId);
            if(!user) {
                return res.status(500).json({error: 'User not exist'});
            }

            if(!req.file || !req.file.originalname) {
                return res.status(500).json({error: 'arquive is not found'});
            }

            const { description } = req?.body;

            if (!req || !req.file) {
                return res.status(400).json({ error: 'arguments invalid' });
            }
            if (description?.length < 2 || !description) {
                return res.status(400).json({ error: 'description short' })
            }

            const image = await uploadImageCosmic(req);
            const post = {
                idUser: user._id,
                description,
                photo: image?.media?.url,
                data: new Date()
            }

            await postModel.create( post );
            return res.status(200).json({ msg: 'deu certo' })

        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: 'sevidor' })
        }
    });

export const config = {
    api: {
        bodyParser: false
    }
}

export default JWTvalidator(conectMongoDB(handler));