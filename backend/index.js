import express from "express"
import cors from 'cors'
import dotenv from "dotenv"
import DbConnection from "./config/db.js"
import router from "./routes/authRoutes.js"
const app = express()

dotenv.config()
DbConnection()
app.use(express.json()) // for postman raw data
app.use('/uploads', express.static('uploads'));
app.use(cors())

app.use('/api/auth',router)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))