import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";

const startServer = async() => {
    
      //connect to DB
      await connectDB()
      const PORT=config.port|| 3000;

      app.listen(PORT, () => {
        console.log(`Server is running at port: ${PORT}`);
      })
}

startServer();