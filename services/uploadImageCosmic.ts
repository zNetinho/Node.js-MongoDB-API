import cosmic from 'cosmicjs';
import multer from 'multer';

const {
    BUCKET_AVATARES,
    CHAVE_LEITURA_AVATARES,
    CHAVE_GRAVACAO_AVATARES,
    CHAVE_GRAVACAO_PUBLICACAO,
    CHAVE_LEITURA_PUBLICACAO,
    BUCKET_PUBLICACOES
} = process.env

const cosmicjs = cosmic();

const bucketAvatares = cosmicjs.bucket({
    slug: BUCKET_AVATARES,
    write_key: CHAVE_GRAVACAO_AVATARES,
    read_key: CHAVE_LEITURA_AVATARES
});

const bucketPublicacoes = cosmicjs.bucket({
    slug: BUCKET_PUBLICACOES,
    write_key: CHAVE_GRAVACAO_PUBLICACAO,
    read_key: CHAVE_LEITURA_PUBLICACAO
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

const uploadImageCosmic = async (req: any) => {
    if (req?.file?.originalname) {

        if(!req.file.originalname.includes('.png') &&
           !req.file.originalname.includes('.jpg') &&
           !req.file.originalname.includes('.jpeg')) {
            throw new Error('Extension arquive not support')
           }

        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer
        };

        if (req.url && req.url.includes('publication')) {
            return await bucketPublicacoes.addMedia({ media: media_object });
        } else {
            return await bucketAvatares.addMedia({ media: media_object });
        }

    }
}

export { upload, uploadImageCosmic }