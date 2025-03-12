// Importar dependencias
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const NodeCache = require("node-cache");
require("dotenv").config(); // Cargar variables de entorno

// Configurar Express y caché
const app = express();
const port = process.env.PORT || 3000;
const cache = new NodeCache({ stdTTL: 3600 }); // Cache válido por 1 hora

// Clave de API (desde variables de entorno)
const apiKey = process.env.SERPAPI_KEY;

// Middlewares
app.use(cors());
app.use(express.static("public"));

// Lista de tiendas permitidas
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

// Ruta para buscar materiales
app.get("/buscar", async (req, res) => {
  const consulta = req.query.q?.trim();
  const limit = parseInt(req.query.limit) || 10; // Límite de resultados (por defecto: 10)

  // Validar entrada
  if (!consulta || consulta.length < 3) {
    return res.json({ respuesta: "Por favor, ingresa un término de búsqueda válido (mínimo 3 caracteres)." });
  }

  // Verificar si los resultados están en caché
  const cachedResults = cache.get(consulta);
  if (cachedResults) {
    return res.json({ respuesta: cachedResults });
  }

  try {
    // Hacer la petición a la API de SerpAPI
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

    // Si no hay resultados
    if (resultados.length === 0) {
      return res.json({ respuesta: "No se encontraron productos con precios para esta búsqueda en Antofagasta." });
    }

    // Filtrar resultados por tiendas permitidas
    resultados = resultados.filter((item) =>
      tiendasPermitidas.some((tienda) => item.source?.toLowerCase().includes(tienda.toLowerCase()))
    );

    // Si no hay resultados después del filtrado
    if (resultados.length === 0) {
      return res.json({ respuesta: "No se encontraron productos en tiendas locales de Antofagasta." });
    }

    // Formatear resultados
    let mensaje = "<strong>Resultados encontrados:</strong><br>";
    resultados.slice(0, limit).forEach((item) => {
      mensaje += 
        <div class="producto">
          <p><strong>${item.title}</strong></p>
          <p>💰 Precio: <span class="precio">${item.price || "N/A"}</span></p>
          <p>🏪 Tienda: ${item.source || "No especificada"}</p>
          <a href="${item.link}" target="_blank" class="ver-producto">🔗 Ver producto</a>
        </div>
      ;
    });

    // Guardar en caché
    cache.set(consulta, mensaje);

    // Enviar respuesta
    res.json({ respuesta: mensaje });
  } catch (error) {
    console.error("Error en la búsqueda:", error.message);
    if (error.response) {
      // Error de la API (por ejemplo, clave inválida)
      return res.status(500).json({ respuesta: "Error en la API. Verifica la clave o intenta más tarde." });
    } else if (error.request) {
      // No se recibió respuesta de la API
      return res.status(500).json({ respuesta: "No se pudo conectar con la API. Intenta más tarde." });
    } else {
      // Otros errores
      return res.status(500).json({ respuesta: "Error interno del servidor." });
    }
  }
});

// Ruta de inicio (documentación básica)
app.get("/", (req, res) => {
  res.send(
    <h1>API del Cotizador de Materiales</h1>
    <p>Endpoints disponibles:</p>
    <ul>
      <li><strong>GET /buscar?q=consulta</strong>: Busca materiales en tiendas de Antofagasta.</li>
    </ul>
  );
});

// Iniciar servidor
app.listen(port, () => {
  console.log(🚀 Servidor corriendo en http://localhost:${port});
});
