import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserDao from '../daos/mongodb/user.dao.js';

const userDao = new UserDao();

const strategyOptions = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
};

/* ----------------------------- lógica registro ---------------------------- */
const register = async(req, email, password, done) => {
    try {
        // const { first_name, last_name,... } = req.body
        const user = await userDao.getByEmail(email);
        if (user) return done(null, false);
        const newUser = await userDao.registerUser(req.body);
        return done(null, newUser);
    } catch (error) {
        console.log(error);
    }
};


/* ------------------------------ lógica login ------------------------------ */
const login = async(req, email, password, done) => {
    try {
        const userLogin = await userDao.loginUser(email, password);
        console.log('LOGIN', userLogin);
        if(!userLogin) return done(null, false, { message: 'User not found' });
        return done(null, userLogin);
    } catch (error) {
        console.log(error);
    }
};

/* ------------------------------- strategies ------------------------------- */
const registerStrategy = new LocalStrategy(strategyOptions, register);
const loginStrategy = new LocalStrategy(strategyOptions, login);

/* ----------------------------- inicializacion ----------------------------- */
passport.use('login', loginStrategy);
passport.use('register', registerStrategy);

/* ------------------------- serialize y deserialize ------------------------ */
//guarda al usuario en req.session.passport
//req.session.passport.user --> id del usuario
passport.serializeUser((user, done)=>{
    done(null, user._id);
    //console.log("user._id -> ", user._id); //user._id ->  new ObjectId("64e56013c2fdd8c7f0e480ce")
});

passport.deserializeUser(async(id, done)=> {
    console.log("id ->", id); //id -> 64e56013c2fdd8c7f0e480ce
    console.log("typeof(id) -> ", typeof(id));
    const user = await userDao.getById(id);
    return done(null, user);
});