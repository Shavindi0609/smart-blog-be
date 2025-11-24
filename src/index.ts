import express from "express"
import cors from "cors"
import authRoutes from './routes/auth.routes';
import dotenv from "dotenv"
import mongoose from "mongoose";
dotenv.config()

const SERVER_PORT = process.env.SERVER_PORT
const MONGO_URL = process.env.MONGO_URL as string

const app = express()

app.use(express.json());


app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"] //optiona
})
)

app.use('/api/v1/auth', authRoutes);

mongoose.connect(MONGO_URL).then(() => {
    console.log("DB Connected")
})
.catch((err) => {
    console.error(`DB Connection fail:,${err}`)
    process.exit(1)
})


app.listen(5000, () => {
    console.log("Server is running")
})