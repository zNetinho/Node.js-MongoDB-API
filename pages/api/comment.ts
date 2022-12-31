import { NextApiRequest, NextApiResponse } from 'next';
import { msgPadrao } from '../../types/msgPadrao';
import { userModel } from './../../models/userModels';
import { postModel } from './../../models/postModels';
import { corsRules } from '../../middlewares/corsRules';
import { JWTvalidator } from '../../middlewares/validatorJWT';
import { conectMongoDB } from '../../middlewares/conectionDB';
const endPointComment = async (req: NextApiRequest, res: NextApiResponse<msgPadrao>) => {
    try {
        if(req.method === 'PUT'){
            const {userId, id} = req.query 
            const userLogged = await userModel.findById(userId);
            if(!userLogged) {
                return res.status(400).json({error: 'User not found'})
            }
            console.log(userLogged)

            const post = await postModel.findById(id);
            if(!post) {
                return res.status(400).json({error: 'Post não encontrado'})
            }
            console.log(post)
            
            const comments = {
                idUser: userLogged._id,
                name: userLogged.name,
                comments: req.body.comment
            }
            
            if(!req.body || !req.body.comment || req.body.comment.length < 1) {
                return res.status(400).json({error: 'não a nada no comentario.'})
            }

            post.comments.push(comments);
            console.log(comments)
            await postModel.findByIdAndUpdate({_id: post._id}, post);
            return res.status(200).json({msg: 'comentario adicionado com sucesso'})
        }
    } catch (error) {
        
    }
}

export default corsRules(JWTvalidator(conectMongoDB(endPointComment)))