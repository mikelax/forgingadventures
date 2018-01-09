import { checkAuth0Secret } from 'middleware/security';
import postUsers from './usersImpl';

const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('API Index');
});

router.post('/users', checkAuth0Secret(), postUsers());


export default router;
