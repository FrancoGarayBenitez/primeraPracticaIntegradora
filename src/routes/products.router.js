const { Router } = require('express');
const { productModel } = require('../models/product.model');
//Importamos la clase de manager.fileSystem.js
const { Contenedor } = require('../dao/manager.fileSystem');
const router = Router();

//Instancia a clase para utilizar File System.
const products = new Contenedor('products.json');

router.get("/", async (req, res) => {
    try {
        let products = await productModel.find();
        res.send({ result: "Success", payload: products });
    } catch (error) {
        res.send({ status: error, error: "Error al obtener información de los productos." })
    }
})

router.post("/", async (req, res) => {
    try {
        let { nombre, categoria, precio, stock, imagen } = req.body;

        if (!nombre || !categoria || !precio || !stock || !imagen) {
            res.send({ status: "error", error: "Faltan parámetros para crear el producto." })
        }

        let result = await productModel.create({ nombre, categoria, precio, stock, imagen });
        res.send({ result: "Success", payload: result });

        //FILE SYSTEM
        //Creamos JSON usando FileSystem, le enviamos a manager el objeto y el id creado por MongoAtlas.
        await products.save(req.body, result._id);

    } catch (error) {
        res.send({ status: error, error: "Error al crear producto." });
    }
})

router.put("/:pid", async (req, res) => {
    try {
        let { pid } = req.params;
        let productToReplace = req.body;

        let result = await productModel.updateOne({ _id: pid }, productToReplace);
        res.send({ result: "Success", payload: result });

        //FILE SYSTEM
        //Obtengo información de los productos
        const data = await products.getAll();
        //Obtengo el índice del producto a modificar.
        const indexProduct = data.findIndex((p) => p._id === pid);
        //Actualizo producto en base a los campos modificados
        data[indexProduct] = {
            ...data[indexProduct],
            ...productToReplace
        }
        //Actualizo array de productos
        await products.saveObjects(data);

    } catch (error) {
        res.send({ status: error, error: "Error al actualizar un producto." });
    }
})

router.delete("/:pid", async (req, res) => {
    try {
        let { pid } = req.params;
        let result = await productModel.deleteOne({ _id: pid });
        res.send({ result: "Success", payload: result });

        //FILE SYSTEM
        await products.deleteById(pid);

    } catch (error) {
        res.send({ status: error, error: "Error al eliminar un producto." })
    }
})

module.exports = router;