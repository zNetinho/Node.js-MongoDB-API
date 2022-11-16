import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from 'mongoose';
import { msgPadrao } from '../types/msgPadrao'

//Verifica a conexão e faz a requisição se tudo OK.
export const conectMongoDB = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<msgPadrao>) => {

        if (mongoose.connections[0].readyState) {
            return handler(req, res);
        }

        const { DB_CONEXAO_STRING } = process.env;

        if (!DB_CONEXAO_STRING) {
            return res.status(500).json({ msg: "Erro na variavel de ambiente." })
        }

        await mongoose.connect(DB_CONEXAO_STRING);

        return handler(req, res);
    }
