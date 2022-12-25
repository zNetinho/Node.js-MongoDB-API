import type { NextApiRequest, NextApiResponse } from "next";
import { conectMongoDB } from '../../middlewares/conectionDB'
import { msgPadrao } from '../../types/msgPadrao';
import { registerUser } from '../../types/registerRequest';
import { userModel } from '../../models/userModels';
import md5 from 'md5';
import { upload, uploadImageCosmic } from '../../services/uploadImageCosmic'
import nc from 'next-connect'
import { corsRules } from "../../middlewares/corsRules";

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<msgPadrao>) => {
        console.log('entrou no front', req)
        try {
            const user = req.body as registerUser;

        if (!user.name || user.name.length < 2) {
            console.log('validou o nome')
            return res.status(400).json({ error: 'Nome invalido' })
        }
        if (!user.email || user.email.length < 5
            || !user.email.includes('@')
            || !user.email.includes('.')) {
                console.log('validou o email')
            return res.status(400).json({ error: 'email incorreto' })
        }
        if (!user.password || user.password.length < 6) {
            console.log('validou a senha')
            return res.status(400).json({ error: 'senha invalida' })
        }

        const userEmailDuplicate = await userModel.find({ email: user.email })
        if (userEmailDuplicate && userEmailDuplicate.length > 0) {
            console.log('validou a duplicidade')
            return res.status(400).json({ error: 'email already exist' })
        }

        const imageRedyState = await uploadImageCosmic(req);

        const userToSave = {
            name: user.name,
            email: user.email,
            password: md5(user.password),
            avatar: imageRedyState?.media?.url
        }

        await userModel.create(userToSave)
        return res.status(200).json({ msg: "Tudo ok" })
        } catch (error) {
            console.log(error)
        }
        
    });

export const config = {
    api: {
        bodyParser: false
    }
}

export default corsRules(conectMongoDB(handler));