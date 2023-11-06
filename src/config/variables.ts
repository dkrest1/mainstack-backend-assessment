import  "dotenv/config"

const NODE_ENV = process.env.NODE_ENV as string;
const PORT = process.env.PORT as string;
const MONGO_DB_URI = process.env.MONGO_DB_URI as string;
const CLIENT_URL = process.env.CLIENT_URL as string;
const DATA_LIMIT = process.env.DATA_LIMIT as string;
const HASH = process.env.HASH as string;

export {
    NODE_ENV,
    PORT,
    MONGO_DB_URI,
    CLIENT_URL,
    HASH,
    DATA_LIMIT,
}