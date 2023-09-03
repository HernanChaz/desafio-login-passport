import { Router } from "express";
import passport from 'passport';
import { registerUser, loginUser, logoutUser, githubResponse } from "../controllers/user.controllers.js";

const router = Router();

router.post('/register', passport.authenticate('register'), registerUser);

router.post('/login', passport.authenticate('login'), loginUser);

router.get('/logout', logoutUser);

router.get('/register-github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/profile-github', passport.authenticate('github', { scope: ['user:email'] }), githubResponse);

export default router;