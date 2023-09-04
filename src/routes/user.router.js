import { Router } from "express";
import passport from 'passport';
import { logoutUser, githubResponse } from "../controllers/user.controllers.js";

const router = Router();

router.post(
    '/register', passport.authenticate('register', {
        successRedirect: "/?loginOk=true",
        failureRedirect: "/error-register",
        passReqToCallback: true,
    })
);

router.post('/login', passport.authenticate('login', {
        successRedirect: "/products",
        failureRedirect: "/error-login",
        passReqToCallback: true,
    })
);

router.get('/logout', logoutUser);

router.get(
    '/register-github', 
    passport.authenticate('github', { 
        scope: ['user:email'] 
    })
);

router.get(
    '/profile-github', 
    passport.authenticate("github", {
        scope: ["user:email"],
        successRedirect: "/products",
        failureRedirect: "/error-login",
      })
);

export default router;