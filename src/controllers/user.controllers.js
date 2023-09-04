import UserDao from "../daos/mongodb/user.dao.js";
const userDao = new UserDao();

export const registerUser = async(req, res) => {
    try {
        const newUser = await userDao.registerUser(req.body);
        if(newUser) res.redirect('/');
        else res.redirect('/error-register');
    } catch (error) {
        console.log(error);
    }
};

export const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userDao.loginUser(email, password);
        if(user) {
            req.session.user = user;
            res.redirect('/api/products');
        } else {
            res.redirect('/error-login')
        };
    } catch (error) {
        console.log(error);
    }
};

export const logoutUser = async(req, res) => {
    req.session.destroy();
    res.redirect("/");
};

export const githubResponse = async (req, res, next) => {
    try {
      console.log("req.user ->", req.user)
      const { first_name, last_name, email, isGithub } = req.user;
      res.json({
        msg: "Register/Login Github OK",
        session: req.session,
        userData: {
          first_name,
          last_name,
          email,
          isGithub,
        },
      });
    } catch (error) {
      next(error.message);
    }
};