import {config as conf} from "dotenv";

conf(); // Load environment variables from .env

const _config={
    port:process.env.PORT,
    databaseURL:process.env.MONGO_URL,
    env:process.env.NODE_ENV
}

export const config=Object.freeze(_config);