import UserDaoMongoDB from "../daos/mongodb/user.dao.js";
const userDao = new UserDaoMongoDB();

export const getById = async (id) => {
    try {
        const userDB = await userDao.getById(id);
        if(!userDB) return false;
        else return userDB;
    } catch (err) {
        console.log(err);
    }
}