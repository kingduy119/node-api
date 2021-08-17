import { Router } from "express";
import * as ProductCtrl from "./product.controller";

const router = Router();

router.get('/product', ProductCtrl.find );
router.post('/product', ProductCtrl.create );
router.get('/product/:slug', ProductCtrl.findById );
router.put('/product/:slug', ProductCtrl.updateById );
router.delete('/product/:slug', ProductCtrl.deleteById );

export default router;