import { Router } from "express";
import * as UserController from "./user.controller";

const router = Router();

router.get('/user', UserController.fetchMany );
router.post('/user', UserController.createProfile );
router.get('/user/:userId', UserController.fetchProfile );
router.put('/user/:userId', UserController.updateProfile );
router.delete('/user/:userId', UserController.deleteProfile );


export default router;
