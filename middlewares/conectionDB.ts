import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from 'mongoose';

export const conectMongoDB = (handler: NextApiHandler) => 
    (req: NextApiRequest, res: NextApiResponse) => {
        
    }