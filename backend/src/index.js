import express from "express"
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import messageRoutes from "./routes/message.route.js"
import cors from "cors"

dotenv.config();
const app = express();


const PORT= process.env.PORT;

app.use(express.json()); // extract json data from the body.(Has to be before routes)
app.use(cookieParser()); // Parse the cookie
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))




app.use("/api/auth", authRoutes)  //Whenever we are on signup/login we would like to call this route
app.use("/api/message", messageRoutes)

app.listen(PORT, () => {console.log(`Server is running on PORT: ${PORT}`)
connectDB();
});