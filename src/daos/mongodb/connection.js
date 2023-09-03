import mongoose from 'mongoose';

export const connectionString = 'mongodb+srv://admin:admin@cluster0.ybm7tig.mongodb.net/ecommerce?retryWrites=true&w=majority'

try {
    await mongoose.connect(connectionString);
    console.log('Conectado a MongoDB');
} catch (error) {
    console.log(error);
}