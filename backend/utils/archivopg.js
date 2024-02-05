const dotenv = require('dotenv')
const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid')

dotenv.config()

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    allowExitOnIdle: true
})

const reportarConsulta = async (req, _, next) => {
    const datosIngresados = req.body
    const url = req.url
    console.log(`
    hoy ${new Date()}
    se ha recibido una consulta
    en la ruta ${url} con los
    los siguientes datos:`, datosIngresados)
    next()
}

const obtenerPost = async () => {
    try {
        const { rows } = await pool.query("SELECT * FROM posts;")
        return rows
    } catch (error) {
        console.error('Error al obtener los registros:', error)
        return { code: 500, error }
    }
}

const AgregarPost = async (titulo, img, descripcion) => {
    try {
        const id = uuidv4()
        const consulta = "INSERT INTO posts (id, titulo, img, descripcion) VALUES ($1, $2, $3, $4) RETURNING *;"
        const values = [id, titulo, img, descripcion]
        const { rows } = await pool.query(consulta, values)
        console.log("post agregado")
        return rows
    } catch (error) {
        console.log(error)
        return { code: 500, error }
    }
}

const updatePost = async (id) => {
    try {
        const consulta =
            "UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING*;";
        const values = [id]
        const { rows } = await pool.query(consulta, values)
        console.log(rows);
        return rows
    } catch (error) {
        console.error("Error al agregar likes:", error)
        return { code: 500, error }
    }
};

const deletePost = async (id) => {
    try {
        const consulta = "DELETE FROM posts WHERE id = $1 RETURNING*;"
        const values = [id]
        const { rows } = await pool.query(consulta, values)
        console.log(rows)
        return rows
    } catch (error) {
        console.error("Error al eliminar el post:", error)
        return { code: 500, error }
    }
}

module.exports = { AgregarPost, obtenerPost, updatePost, deletePost, reportarConsulta }
