const express = require("express")
const cors = require("cors")
const {
    AgregarPost,
    obtenerPost,
    updatePost,
    deletePost,
    reportarConsulta,
} = require("../utils/archivopg.js")

const app = express()

app.use(express.json())
app.use(cors())

app.get("/posts", async (_, res) => {
    const posteos = await obtenerPost()
    res.json(posteos)
})

app.post("/posts", reportarConsulta, async (req, res) => {
    const { titulo, img, descripcion } = req.body
    try {
        await AgregarPost(titulo, img, descripcion)
        res.status(201).json({ mensaje: "Publicación agregada con éxito" })
    } catch (error) {
        console.error("Error al agregar la publicación:", error)
        res.status(500).json({ error: "Error interno del servidor" })
    }
})

app.put("/posts/like/:id", async (req, res) => {
    const { id } = req.params
    try {
        await updatePost(id)
        res.status(200).json("Post modificado con éxito")
    } catch (error) {
        console.log("error al dar like", error)
    }
})

app.delete("/posts/:id", async (req, res) => {
    const { id } = req.params
    try {
        await deletePost(id)
        res.status(204).json("Post eliminado con éxito")
    } catch (error) {
        console.log("error al eliminar", error)
    }
})

app.listen(3000, console.log("¡Servidor encendido!"))
