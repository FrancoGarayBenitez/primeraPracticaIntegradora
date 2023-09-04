const { Router } = require('express');
const { userModel } = require('../models/user.model');
const router = Router();
//Importamos la clase de manager.fileSystem.js
const { Contenedor } = require('../dao/manager.fileSystem');
//Instancia a clase Contenedor para usar File System.
const users = new Contenedor('users.json');

router.get("/", async (req, res) => {
    try {
        let users = await userModel.find();
        res.send({ result: "Success", payload: users });
    } catch (error) {
        res.send({ status: error, error: "Error al obtener información." })
    }
})

router.post("/", async (req, res) => {
    try {
        let { nombre, email } = req.body;

        if (!nombre || !email) {
            res.send({ status: "error", error: "Faltan parámetros" })
        }

        let result = await userModel.create({ nombre, email });
        res.send({ result: "Success", payload: result });

        //FILE SYSTEM
        //Creamos JSON usando FileSystem, le enviamos a manager el objeto y el id creado por MongoAtlas.
        await users.save(req.body, result._id);

    } catch (error) {
        res.send({ status: error, error: "Error al crear usuario." })
    }
})

router.put("/:uid", async (req, res) => {
    try {
        let { uid } = req.params;
        let userToReplace = req.body;

        let result = await userModel.updateOne({ _id: uid }, userToReplace);
        res.send({ result: "Success", payload: result });

        //FILE SYSTEM
        //Obtengo información de los usuarios
        const data = await users.getAll();
        //Obtengo el índice del usuario a modificar.
        const indexUser = data.findIndex((u) => u._id === uid);
        //Actualizo usuario en base a los campos modificados
        data[indexUser] = {
            ...data[indexUser],
            ...userToReplace
        }
        //Actualizo array de usuarios
        await users.saveObjects(data);

    } catch (error) {
        res.send({ status: error, error: "Error al actualizar un usuario." })
    }
})

router.delete("/:uid", async (req, res) => {
    try {
        let { uid } = req.params;
        let result = await userModel.deleteOne({ _id: uid });
        res.send({ result: "Success", payload: result });

        //FILE SYSTEM
        await users.deleteById(uid);
        
    } catch (error) {
        res.send({ status: error, error: "Error al eliminar un usuario." })
    }
})


module.exports = router;