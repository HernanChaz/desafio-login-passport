import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';

import { __dirname, mongoStoreOptions } from './utils.js';
import { errorHandler } from './middlewares/errorHandler.js';
import morgan from 'morgan';
import { Server } from 'socket.io';
import 'dotenv/config';

/* ---------------------------------- rutas --------------------------------- */
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import viewRouter from './routes/views.router.js';
import userRouter from './routes/user.router.js';

/* ----------------------------- acceso a datos ----------------------------- */
import ProductDaoMongoDB from "./daos/mongodb/productDao.js";
import MessagesDaoMongoDB from "./daos/mongodb/messageDao.js";
const productDao = new ProductDaoMongoDB();
const messagesDao = new MessagesDaoMongoDB();
//import ProductDaoFS from '../daos/filesystem/productDao.js';
//import MessagesDaoFS from '../daos/filesystem/messagesDao.js';
//const productDao = new ProductDaoFS();
//const messagesDao = new MessagesDaoFS();

/* -------------------------------- passport -------------------------------- */
import passport from 'passport';
import "./passport/local-strategy.js";
import "./passport/github-strategy.js";

/* --------------------------- configuración del server -------------------------- */
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static(__dirname + '/public'));
app.use(errorHandler);
app.use(morgan('dev'));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(session(mongoStoreOptions));

/* ----------------------- passport antes de las rutas ---------------------- */
app.use(passport.initialize());
app.use(passport.session());

/* ---------------------------------- rutas --------------------------------- */
app.use('/', viewRouter);
app.use('/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const PORT = process.env.PORT;

const httpServer = app.listen(PORT, ()=>{
    console.log(`Server ok on port ${PORT}`);
})

/* ------------------------------ socketServer ----------------------------- */
const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket) => {

    console.log(`User connected ${socket.id}`);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('newUser', (user)=>{
        console.log(`>${user} inició sesión`);
    })

    socket.on('chat:message', async(msg) =>{
        await messagesDao.createMsg(msg);
        socketServer.emit('messages', await messagesDao.getAll());
    })

    socket.emit('msg', 'bienvenido al chat');

    socket.on('newUser', (user)=>{
        socket.broadcast.emit('newUser', user);
    })

    socket.on('chat:typing', (user)=>{
        socket.broadcast.emit('chat:typing', user)
    })

    socket.emit('allProducts', await productDao.getProducts());
    
})
