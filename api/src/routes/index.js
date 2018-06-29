import multer from 'multer';

import { resendVerificationEmail } from 'services/auth0';
import uploadUserPicture from './imageUploadImpl';
import { setDbUserByToken } from '../middleware/security';

const router = require('express').Router();

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5000000 } // limit max upload file to 5MB
});

router.post('/upload-image', uploader.single('picture'), setDbUserByToken, uploadUserPicture);
router.post('/verify-email', (req, res, next) => {
  return resendVerificationEmail(req.user.sub)
    .then((responseData) => {
      return res.json(responseData.data);
    })
    .catch((error) => {
      return next(error);
    });
});


export default router;
