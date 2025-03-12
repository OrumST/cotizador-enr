// Importar dependencias
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const NodeCache = require("node-cache");
const dotenv = require("dotenv");

// Cargar variables de entorno si existe el archivo .env
dotenv.config();

// Configuración del servidor y caché
const app = express();
const port = process.env.PORT || 3000;
const cacheTTL = parseInt(process.env.CACHE_TTL) || 3600; // Tiempo de caché en segundos (por defecto: 1 hora)
const cache = new NodeCache({ stdTTL: cacheTTL });
const apiKey = process.env.SERPAPI_KEY;

// Middlewares
app.use(cors());
app.use(express.static("public"));

// Lista de tiendas permitidas (convertida en Set para búsqueda más rápida)
const tiendasPermitidas = new Set([
  "sodimac antofagasta",
  "construmart antofagasta",
  "easy antofagasta",
  "mts antofagasta",
  "ferretería prat",
  "imperial antofagasta",
  "construmart",
  "sodimac",
  "easy",
  "homecenter antofagasta"
]);

/**
 * Filtra los resultados para incluir solo las tiendas permitidas
 * @param {Array} resultados - Lista de productos de la API
 * @returns {Array} - Lista filtrada de productos
 */
const filtrarTiendas = (resultados) => {
  return resultados.filter((item) => {
    const tienda = item.source?.toLowerCase() || "";
    return Array.from(tiendasPermitidas).some((permitida) => tienda.includes(permitida));
  });
};

/**
 * Formatea los resultados en HTML
 * @param {Array} resultados - Lista de productos filtrados
 * @param {number} limit - Límite de resultados a mostrar
 * @returns {string} - HTML con los productos
 */
const formatearResultados = (resultados, limit) => {
  return resultados.slice(0, limit).map((item) => `
    <div class="producto">
      <p><strong>${item.title}</strong></p>
      <p>💰 Precio: <span class="precio">${item.price || "N/A"}</span></p>
      <p>🏪 Tienda: ${item.source || "No especificada"}</p>
      <a href="${item.link}" target="_blank" class="ver-producto">🔗 Ver producto</a>
    </div>
  `).join("");
};

// Ruta principal para búsqueda
app.get("/buscar", async (req, res) => {
  try {
    const consulta = req.query.q?.trim();
    const limit = parseInt(req.query.limit) || 10;

    if (!consulta || consulta.length < 3) {
      return res.json({ respuesta: "Por favor, ingresa un término de búsqueda válido (mínimo 3 caracteres)." });
    }

    // Verificar caché
    const cachedResults = cache.get(consulta);
    if (cachedResults) return res.json({ respuesta: cachedResults });

    // Llamar a la API
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_shopping",
        q: `${consulta} Antofagasta`,
        hl: "es",
        gl: "cl",
        location: "Antofagasta, Chile",
        api_key: apiKey,
      },
    });

    let resultados = response.data?.shopping_results || [];
    if (resultados.length === 0) {
      return res.json({ respuesta: "No se encontraron productos en Antofagasta." });
    }

    // Filtrar por tiendas locales
    resultados = filtrarTiendas(resultados);
    if (resultados.length === 0) {
      return res.json({ respuesta: "No se encontraron productos en tiendas locales de Antofagasta." });
    }

    // Formatear y responder
    const respuestaHTML = `<strong>Resultados encontrados:</strong><br>` + formatearResultados(resultados, limit);
    cache.set(consulta, respuestaHTML); // Guardar en caché solo si hay resultados

    res.json({ respuesta: respuestaHTML });
  } catch (error) {
    console.error("Error en la búsqueda:", error.message);
    res.status(500).json({ respuesta: "Error al obtener resultados. Intenta nuevamente más tarde." });
  }
});

// Ruta de inicio (documentación básica)
app.get("/", (req, res) => {
  res.send(`
    <h1>API del Cotizador de Materiales</h1>
    <p>Endpoints disponibles:</p>
    <ul>
      <li><strong>GET /buscar?q=consulta</strong>: Busca materiales en tiendas de Antofagasta.</li>
    </ul>
  `);
});

// Iniciar servidor
app.listen(port, () => console.log(`🚀 Servidor corriendo en http://localhost:${port}`));
