import { Router } from "express";
import * as UserController from "./user.controller";

const router = Router();

router.get('/users', UserController.getUsers );
router.post('/users', UserController.postUsers );
router.get('/users/:userId', UserController.getUserId );
router.put('/users/:userId', UserController.updateUserId );
router.delete('/users/:userId', UserController.deleteUserId );


export default router;
