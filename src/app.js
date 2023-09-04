const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users.router');
const productRouter = require('./routes/products.router');
const PORT = 8080;
const app = express();

//Middleware para analizar el cuerpo de las solicitudes.
app.use(express.json());

//Escuchando servidor
app.listen(PORT, () => {
    console.log(`Servidor is running on port ${PORT}`);
})

//Conexión con Mongoose
mongoose.connect("mongodb+srv://francogaray4:fg_dbUser_84@cluster0.9vspn3d.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(() => {
        console.log("Conectado a la base de datos de MongoDB Atlas.");
    })
    .catch((error) => {
        console.log("Error al conectar", error);
    })

//Paths
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);