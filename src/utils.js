import { dirname } from 'path';
import { fileURLToPath } from 'url';
export const __dirname = dirname(fileURLToPath(import.meta.url));

import MongoStore from 'connect-mongo';
import { connectionString } from './db/dbConnection.js';

import bcrypt from 'bcrypt';

export const mongoStoreOptions = {
    store: MongoStore.create({
        mongoUrl: connectionString,
        crypto: {
            secret: '1234'
        }
    }),
    secret: '1234',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
};

/**
 * funcion que realiza el encriptado de contraseña a través de bcrypt con el método hashSync. 
 * Recibe password sin encriptar y retorna password encriptada
 * @param password -> string
 * @returns password encriptada/hasheada -> string
 */
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

/**
 * 
 * @param {*} user usuario encontrado en base de datos.
 * @param {*} password contraseña proporcionada por el usuario, sin encriptar -> string
 * @returns boolean
 */
export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);