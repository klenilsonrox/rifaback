import express from "express"
import cors from "cors"
import { connectDB } from "./database/connectDB.js"
import routerUsers from "./routes/userRoutes.js"
import routerRifa from "./routes/rifaRoutes.js"

const app = express()
app.use(express.json())
app.use(cors())
app.use("/api", routerUsers)
app.use("/api", routerRifa)
app.use("/", (req,res)=>{
    return res.status(200).json({ok:true})
})



connectDB()

app.listen(process.env.PORT || 3001, ()=>{
    console.log(`conectado com sucesso em http://localhost${process.env.PORT}`)
})