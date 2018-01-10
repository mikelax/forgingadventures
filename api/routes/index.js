import multer from 'multer';

import { checkAuth0Secret, checkJwt } from 'middleware/security';
import { postUsers, uploadUserPicture } from './usersImpl';

const router = require('express').Router();

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5000000 } // limit max upload file to 5MB
});

router.get('/', (req, res) => {
  res.send('API Index');
});

router.post('/users', checkAuth0Secret(), postUsers());
router.post('/users/:auth0Id/profile/image', checkJwt(), uploader.single('picture'), uploadUserPicture());


export default router;
