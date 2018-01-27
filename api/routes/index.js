import multer from 'multer';

import { uploadUserPicture } from './usersImpl';
import { setDbUserByToken } from '../middleware/security';

const router = require('express').Router();

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5000000 } // limit max upload file to 5MB
});

router.get('/', (req, res) => {
  res.send('API Index');
});

router.post('/users/profile-image', uploader.single('picture'), setDbUserByToken, uploadUserPicture);


export default router;
