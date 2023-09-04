const fs = require('fs').promises;

class Contenedor {
    constructor(file) {
        this.file = file
    }

    async save(object, id) {
        try {
            //Obtengo información del array
            const objects = await this.getAll()

            //Creamos el nuevo objeto con los parámetros recibidos
            const newObj = {
                _id: id,
                ...object
            }

            //Lo guardamos en el array y actualizamos json.
            objects.push(newObj)
            await this.saveObjects(objects)

        } catch (error) {
            return new Error("Error al guardar el objeto")
        }
    }

    async getAll() {
        try {
            //Obtenemos la información del archivo pasado por parámetro al constructor
            const data = await fs.readFile(this.file, "utf-8")
            return data ? JSON.parse(data) : []

        } catch (error) {
            return []
        }
    }

    async deleteById(id_obj) {
        try {
            //Obtenemos el array con los objetos
            let objects = await this.getAll()
            //Modificamos el array original eliminando el objeto indicado por parámetro.
            objects = objects.filter((obj) => obj._id !== id_obj)
            //Actualizamos el array en el archivo
            await this.saveObjects(objects)

        } catch (error) {
            return new Error("Error al eliminar el objeto.")
        }
    }

    async saveObjects(objects) {
        try {
            await fs.writeFile(this.file, JSON.stringify(objects, null, 2))
        } catch (error) {
            return new Error("Error al guardar objetos.")
        }
    }

}


//Exportamos class Contenedor
module.exports = { Contenedor };