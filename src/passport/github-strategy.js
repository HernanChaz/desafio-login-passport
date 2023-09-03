import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import UserDao from '../daos/mongodb/user.dao.js';

const userDao = new UserDao();

const strategyOptions = {
    clientID: 'Iv1.ac91125595383709',
    clientSecret: 'd6d0cfe8b8914aabecf3fd2597d2a7dc50901c74',
    callbackURL: 'http://localhost:8080/users/profile-github',
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