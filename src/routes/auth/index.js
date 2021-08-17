const router = require("express").Router();
import { google, oauth2callback, signin, signup, signout } from './auth.controller';

router.get('/oauth2callback', oauth2callback);
router.get('/google', google);
router.post('/signup', signup);
router.post('/signin', signin);
// router.post('/signout', signout);

export default router;
