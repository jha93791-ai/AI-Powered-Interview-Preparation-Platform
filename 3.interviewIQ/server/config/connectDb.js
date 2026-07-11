import mongoose from "mongoose";

const connectDb = async () => {
    const configuredUri = process.env.MONGODB_URL || process.env.MONGO_URL;
    const fallbackUri = process.env.LOCAL_MONGODB_URL || "mongodb://127.0.0.1:27017/interviewiq";
    const candidateUris = [configuredUri, fallbackUri].filter(Boolean);

    let lastError = null;

    for (const uri of candidateUris) {
        try {
            await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 30000,
                retryWrites: true,
                w: "majority",
            });
            console.log("DataBase Connected");
            return uri;
        } catch (error) {
            lastError = error;
            console.warn(`MongoDB connection attempt failed for ${uri}:`, error.message);
        }
    }

    throw lastError;
};

export default connectDb