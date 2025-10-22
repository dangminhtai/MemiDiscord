import mongoose from "mongoose";

mongoose.set('strictQuery', true);

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Đã kết nối với Database');
    } catch (err) {
        console.error('Lỗi kết nối với Database', err);
    }
}

export { connectDB };
