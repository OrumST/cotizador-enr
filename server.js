const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Datos de ejemplo (se pueden reemplazar con una BD)
const productos = [
    { id: 1, nombre: "Cemento Holcim 25kg", precio: 15000, tienda: "Construmart" },
    { id: 2, nombre: "Ladrillo Princesa", precio: 250, tienda: "Sodimac" },
    { id: 3, nombre: "Plancha OSB 9mm", precio: 12000, tienda: "Easy" }
];

// Ruta para buscar productos por nombre
app.get("/buscar", (req, res) => {
    const query = req.query.q.toLowerCase();
    const resultados = productos.filter(p => p.nombre.toLowerCase().includes(query));
    res.json(resultados);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
