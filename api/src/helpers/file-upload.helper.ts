import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const getFileConfigurationByPath = (desiredPath: string) => ({
    storage: diskStorage({
        destination: desiredPath,
        filename: (req, file: Express.Multer.File, cb) => {
            const filename: string = uuidv4();
            const extension: string = path.parse(file.originalname).ext;
            
            cb(null, `${filename}${extension}`);
        }
    })
})