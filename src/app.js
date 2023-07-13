import express from "express";
import session from "express-session";
import cartRouter from "./routes/cart.router.js";
import productsRouter from "./routes/products.router.js";
import realTimeProductsRouter from "./routes/realTimeProducts.router.js"
import chatRouter from "./routes/chat.router.js"
import sessionsRouter from "./routes/sessions.router.js"
import viewsRouter from "./routes/views.router.js"
import handlebars from "express-handlebars"
import __dirname from "./utils.js";
import {Server} from "socket.io"
import MongoStore from "connect-mongo/build/main/lib/MongoStore.js";
import mongoose from "mongoose";
import displayRoutes from "express-routemap";

const app = express()
const PORT = 8080
const MONGO = "mongodb+srv://apuig137:misiones2021@ecommerce.szekknh.mongodb.net/?retryWrites=true&w=majority"
const connection =  mongoose.connect(MONGO)

app.use(express.static(__dirname + '/public'))

app.engine("handlebars", handlebars.engine())
app.set("views",__dirname+"/views")
app.set("view engine","handlebars")

app.use(express.json())
app.use("/", viewsRouter)
app.use("api/sessions", sessionsRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)
app.use("/api/realtimeproducts", realTimeProductsRouter)
app.use("/api/chat", chatRouter)
app.use(session({
    store:MongoStore.create({
        mongoUrl: MONGO,
        ttl: 3600
    }),
    secret: "CoderSecretSHHHHH",
    resave: false,
    saveUninitialized: false
}))

const httpServer = app.listen(PORT,() => {
    displayRoutes(app)
    console.log(`Servidor arriba en el puerto ${PORT}`)
})

const socketServer = new Server(httpServer)

socketServer.on("connection", async socket => {
    //let messages = await messageModel.find()
    console.log("Nuevo cliente conectado en realTimeProducts", socket.id)
    socket.on("product", (data) => {
        console.log(data)
    })
    //socket.on("message", async (data) => {
    //    await messageModel.create(data)
    //    messages = await messageModel.find() // Actualizar los mensajes después de agregar uno nuevo
    //    socketServer.emit("messageLogs", messages)
    //})
})
