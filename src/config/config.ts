import {config as conf} from "dotenv";

conf(); // Load environment variables from .env

const _config={
    port:process.env.PORT
}

export const config=Object.freeze(_config);