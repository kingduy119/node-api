import { Router } from "express";
import * as CategoryCtrl from "./category.controller";

const router = Router();

router.get('/category', CategoryCtrl.find );
router.post('/category', CategoryCtrl.create );
router.get('/category/:slug', CategoryCtrl.findById );
router.put('/category/:slug', CategoryCtrl.updateById );
router.delete('/category/:slug', CategoryCtrl.deleteById );


export default router;