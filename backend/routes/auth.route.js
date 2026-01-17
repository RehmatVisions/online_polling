import express from 'express'
import { login, signup, logout, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router=express.Router();

// Public routes
router.post('/signup',signup)
router.post('/login',login)
router.post("/logout", logout);

// Protected routes
router.get('/me', protect, getMe);
router.get('/profile', protect, (req,res)=>{
    res.status(200).json({
        message: "Profile fetched successfully",
        user: req.user,
    });
})

export default router;