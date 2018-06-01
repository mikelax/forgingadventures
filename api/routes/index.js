import multer from 'multer';

import uploadUserPicture from './imageUploadImpl';
import { setDbUserByToken } from '../middleware/security';

const router = require('express').Router();

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5000000 } // limit max upload file to 5MB
});

router.post('/upload-image', uploader.single('picture'), setDbUserByToken, uploadUserPicture);


export default router;
