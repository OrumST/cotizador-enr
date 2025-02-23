const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const SERPAPI_KEY = "4cb96a3a5032bf3d519eb1b6a1c0082ecc6b151b318d99531e7bda504f177e92";

app.post('/api/chat', async (req, res) => {
    const userQuery = req.body.query;

    try {
        const response = await axios.get('https://serpapi.com/search', {
            params: {
                api_key: SERPAPI_KEY,
                engine: "google_shopping",
                q: userQuery + " Antofagasta",
                gl: "cl",
                hl: "es"
            }
        });

        const results = response.data.shopping_results || [];
        let answer = "No encontré precios exactos. Aquí tienes algunos enlaces:\n";

        if (results.length > 0) {
            answer = "Aquí tienes opciones con precios:\n";
            results.slice(0, 5).forEach((item, index) => {
                answer += `${index + 1}. ${item.title} - ${item.price} (${item.source})\n${item.link}\n\n`;
            });
        }

        res.json({ answer });
    } catch (error) {
        console.error("Error en SerpAPI:", error);
        res.status(500).json({ answer: "Ocurrió un error al buscar la información." });
    }
});

app.use(express.static('public')); // Asegura que el index.html sea accesible

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
