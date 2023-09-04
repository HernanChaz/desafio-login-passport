import { createHash, isValidPassword } from '../../utils.js';
import { UserModel } from "./models/user.model.js";

export default class UserDao {

    async registerUser(user) {
        try {
            const { email, password } = user;
            const existUser = await UserModel.findOne({ email });
            if(!existUser) {
                const admin = email === "admin@coder.com" && password === "admin1234";
                return await UserModel.create({
                    ...user,
                    role: admin ? "admin" : "user",
                    password: createHash(password),
                });
            } else return false;
        } catch (error) {
            console.log(error);
        }
    };

    async loginUser(email, password) {
        try {
            const userExist = await this.getByEmail(email);
            if(!userExist) return false;
            return isValidPassword(password, userExist) ? userExist : false;
        } catch (error) {
            console.log(error);
        }
    };

    async getByEmail(email) {
        try {
            const userExist = await UserModel.findOne({ email });
            if(userExist) return userExist;
            else return false;
        } catch (error) {
            console.log(error);
        }
    };

    async getById(id) {
        try {
            const userExist = await UserModel.findById( id );
            if(userExist) return userExist;
            else return false;
        } catch (error) {
            console.log(error);
        }
    };
}