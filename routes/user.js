<<<<<<< HEAD
=======

>>>>>>> e8a0b69400c985ecdc3d87f5e13e4a922745963b
import express from "express";
const router = express.Router();
import { requireSignin, authMiddleware, adminMiddleware } from "../controllers/auth.js";
import { read, publicProfile, update, photo } from "../controllers/user.js";




router.get('/user/profile', requireSignin, authMiddleware, read);
router.get('/user/:username', publicProfile);
router.put('/user/update', requireSignin, authMiddleware, update);
router.get('/user/photo/:username', photo);

export default router