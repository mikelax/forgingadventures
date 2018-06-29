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
  console.log(req.user.sub);
  return resendVerificationEmail(req.user.sub)
    .then((responseData) => {
      console.log(`The resp data is: ${JSON.stringify(responseData)}`);
      return res.json(responseData);
    })
    .catch((error) => {
      // console.log(`The error is:  ${JSON.stringify(error)}`);
      return next(error);
    });
});


export default router;
