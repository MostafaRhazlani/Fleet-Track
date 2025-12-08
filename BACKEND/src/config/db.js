import mongoose from 'mongoose';

class Database {

    static connect() {
        try {
            const MONGO_URI = process.env.MONGO_URI
            mongoose.connect(MONGO_URI);
            console.log('Databse is connected');
        } catch (error) {
            console.log('Failed to connect database', error);
        }
    }
}

export default Database;