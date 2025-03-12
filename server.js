// Importar dependencias
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Habilitar CORS para solicitudes desde el frontend
app.use(express.json()); // Habilitar el parsing de JSON

// Ruta para buscar productos en SerpAPI
app.post('/buscar', async (req, res) => {
  const query = req.body.query; // Recibe la consulta desde el frontend

  const serpApiKey = '4cb96a3a5032bf3d519eb1b6a1c0082ecc6b151b318d99531e7bda504f177e92'; // Sustituye con tu clave de SerpAPI
  const serpApiUrl = 'https://serpapi.com/search';

  try {
    // Realizar solicitud a SerpAPI
    const response = await axios.get(serpApiUrl, {
      params: {
        q: query,
        api_key: serpApiKey,
        engine: 'google',
      },
    });

    // Aquí puedes manejar los resultados de la búsqueda y enviar solo los necesarios
    const productos = response.data.organic_results || [];

    res.json({ resultados: productos });
  } catch (error) {
    console.error('Error al obtener datos de SerpAPI:', error);
    res.status(500).send('Error en la búsqueda');
  }
});

// Servir los archivos estáticos del frontend
app.use(express.static('public'));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
