const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Para servir archivos estáticos

// Ruta para buscar productos
app.get('/buscar', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Falta el parámetro de búsqueda' });
    }

    try {
        // Simulación de búsqueda en varias fuentes
        const productos = await buscarProductos(query);
        res.json({ respuesta: productos }); // Cambiado a "respuesta"
    } catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Función que simula la búsqueda en una base de datos
async function buscarProductos(query) {
    // Ejemplo de productos simulados
    const productosEjemplo = [
        {
            nombre: 'Cemento Melón 25kg',
            precio: '$12.990',
            tienda: 'Construmart',
            visitas: Math.floor(Math.random() * 1000),
            imagen: 'https://via.placeholder.com/150',
            link: 'https://www.construmart.cl/cemento-melon' // Cambiado a "link"
        },
        {
            nombre: 'Plancha de OSB 15mm',
            precio: '$18.500',
            tienda: 'Sodimac',
            visitas: Math.floor(Math.random() * 1000),
            imagen: 'https://via.placeholder.com/150',
            link: 'https://www.sodimac.cl/osb-15mm' // Cambiado a "link"
        }
    ];

    // Filtrar productos según la búsqueda
    return productosEjemplo.filter(producto =>
        producto.nombre.toLowerCase().includes(query.toLowerCase())
    );
}

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
