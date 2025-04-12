const express = require("express");
const axios = require("axios");
const cors = require("cors");
const NodeCache = require("node-cache");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const cache = new NodeCache({ stdTTL: 3600 });
const apiKey = process.env.SERPAPI_KEY;

app.use(cors());
app.use(express.static("public"));

const tiendasPermitidas = [
  "Sodimac Antofagasta",
  "Construmart Antofagasta",
  "Easy Antofagasta",
  "MTS Antofagasta",
  "Ferretería Prat",
  "Imperial Antofagasta",
  "Construmart",
  "Sodimac",
  "Easy",
  "Homecenter Antofagasta"
];

app.get("/buscar", async (req, res) => {
  const consulta = req.query.q?.trim();
  const limit = parseInt(req.query.limit) || 10;

  if (!consulta || consulta.length < 3) {
    return res.json({ respuesta: "Ingresa al menos 3 caracteres para buscar." });
  }

  const cachedResults = cache.get(consulta);
  if (cachedResults) {
    return res.json({ respuesta: cachedResults });
  }

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_shopping",
        q: consulta + " Antofagasta",
        hl: "es",
        gl: "cl",
        location: "Antofagasta, Chile",
        api_key: apiKey,
      },
    });

    let resultados = response.data?.shopping_results || [];
    
    if (resultados.length === 0) {
      return res.json({ respuesta: "No se encontraron productos para esta búsqueda en Antofagasta." });
    }

    resultados = resultados.filter((item) =>
      tiendasPermitidas.some((tienda) => item.source?.toLowerCase().includes(tienda.toLowerCase()))
    );

    if (resultados.length === 0) {
      return res.json({ respuesta: "No se encontraron productos en las tiendas de Antofagasta." });
    }

    let mensaje = `<div class="product-grid">`;
    
    resultados.slice(0, limit).forEach((item) => {
      mensaje += `
        <div class="product-card">
          <div class="stock-badge">DISPONIBLE</div>
          <div class="product-title">${item.title}</div>
          <div class="product-price">${item.price || 'Consultar precio'}</div>
          <div class="product-store">${item.source || 'Tienda local'}</div>
          ${item.link ? `<a href="${item.link}" target="_blank" class="product-link">Ver producto</a>` : ''}
        </div>
      `;
    });
    
    mensaje += `</div>`;
    cache.set(consulta, mensaje);
    res.json({ respuesta: mensaje });
    
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ respuesta: "Error al buscar productos. Intenta nuevamente." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log(`🚀 Servidor funcionando en http://localhost:${port}`);
});
