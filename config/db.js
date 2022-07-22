import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export function connectDB() {

    //connection to MongoDB
    mongoose.connect(process.env.MONGODB_DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true});

    //Call a connection fun
    const connection = mongoose.connection;

    connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

    connection.once('open', () => {
        console.log("Database connected....");
    })
}

