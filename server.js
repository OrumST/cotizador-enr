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

// Función para simular stock (en un sistema real, esto vendría de una API)
function verificarStock(tienda) {
  const probabilidades = {
    "sodimac": 0.7,
    "construmart": 0.6,
    "easy": 0.8,
    "mts": 0.5,
    "prat": 0.9,
    "imperial": 0.6,
    "homecenter": 0.7
  };

  const tiendaLower = tienda.toLowerCase();
  for (const [key, prob] of Object.entries(probabilidades)) {
    if (tiendaLower.includes(key)) {
      return Math.random() < prob;
    }
  }
  return Math.random() > 0.4;
}

app.get("/buscar", async (req, res) => {
  const consulta = req.query.q?.trim();
  const limit = parseInt(req.query.limit) || 8;

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
      return res.json({ respuesta: "No encontramos productos para esta búsqueda en Antofagasta." });
    }

    resultados = resultados.filter((item) =>
      tiendasPermitidas.some((tienda) => item.source?.toLowerCase().includes(tienda.toLowerCase()))
    );

    if (resultados.length === 0) {
      return res.json({ respuesta: "No encontramos resultados en las ferreterías de Antofagasta." });
    }

    let mensaje = `<div class="product-grid">`;
    
    resultados.slice(0, limit).forEach((item) => {
      const tieneStock = verificarStock(item.source);
      const stockClass = tieneStock ? "in-stock" : "out-of-stock";
      const stockText = tieneStock ? "DISPONIBLE" : "SIN STOCK";
      
      mensaje += `
        <div class="product-card">
          <div class="stock-status ${stockClass}">${tieneStock ? '✅' : '❌'} ${stockText}</div>
          <div class="product-info">
            <h3>${item.title}</h3>
            <div class="price-tag">${item.price || 'Precio no disponible'}</div>
            <div class="store-badge">${item.source || 'Tienda local'}</div>
            ${item.link ? `<a href="${item.link}" target="_blank" class="product-link">VER PRODUCTO</a>` : ''}
          </div>
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
