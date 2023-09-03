import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import 'dotenv/config';
import UserDao from '../daos/mongodb/user.dao.js';

const userDao = new UserDao();

const PORT = process.env.PORT;

const strategyOptions = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `http://localhost:${PORT}/users/profile-github`,
};

const registerOrLogin = async (accessToken, refreshToken, profile, done) => {
    //console.log('PROFILE --> ', profile);
    const email = profile._json.email !== null ? profile._json.email : profile_json.blog;

    const user = await userDao.getByEmail( email );

    if ( user ) return done( null, user );

    const newUser = await userDao.register({
        first_name: profile._json.name.split(' ')[0],
        last_name: profile._json.name.split(' ')[1],
        email,
        password: '',
        isGithub: true
    });

    return done(null, newUser);
}

passport.use('github', new GithubStrategy(strategyOptions, registerOrLogin));