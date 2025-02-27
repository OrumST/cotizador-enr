const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.SERPAPI_KEY || "4cb96a3a5032bf3d519eb1b6a1c0082ecc6b151b318d99531e7bda504f177e92";

app.use(cors());
app.use(express.static("public"));

// Lista de ferreterías locales de Antofagasta
const ferreteriasLocales = [
  "Ferretería San Carlos",
  "Comercializadora Central",
  "Ferretería Prat",
  "Tienda Würth Antofagasta",
  "Construmart Antofagasta",
  "Sodimac Homecenter Mall Plaza Antofagasta",
  "Planchacor Antofagasta",
  "Ferretería Antofagasta",
  "Ferretería Comerbas",
  "Ferretería VCA",
  "Gatica Hermanos",
];

// Función para buscar productos en Google Shopping
async function buscarProductos(query) {
  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_shopping",
        q: query.split(" ")[0] + " Antofagasta", // Busca solo la primera palabra clave + "Antofagasta"
        hl: "es",
        gl: "cl",
        location: "Antofagasta, Chile",
        api_key: apiKey,
      },
    });

    let resultados = response.data?.shopping_results || [];

    // Filtrar solo tiendas locales y coincidencia parcial en el título
    resultados = resultados.filter((item) => {
      const titulo = item.title.toLowerCase();
      const consultaLower = query.toLowerCase();

      return (
        ferreteriasLocales.some((tienda) =>
          item.source?.toLowerCase().includes(tienda.toLowerCase())
        ) && titulo.includes(consultaLower)
      );
    });

    return resultados;
  } catch (error) {
    console.error("Error al buscar productos:", error.message);
    throw error;
  }
}

// Ruta para buscar productos
app.get("/buscar", async (req, res) => {
  const consulta = req.query.q;

  if (!consulta) {
    return res.json({ respuesta: "Por favor, ingresa un término de búsqueda." });
  }

  try {
    const resultados = await buscarProductos(consulta);

    if (resultados.length === 0) {
      return res.json({ respuesta: "No se encontraron productos en tiendas locales de Antofagasta." });
    }

    let mensaje = "<strong>Resultados encontrados en Antofagasta:</strong><br>";
    resultados.slice(0, 10).forEach((item) => {
      mensaje += `
        <div class="producto">
          <p><strong>${item.title}</strong></p>
          <p>💰 Precio: <span class="precio">${item.price || "N/A"}</span></p>
          <p>🏪 Tienda: ${item.source || "No especificada"}</p>
          <a href="${item.link}" target="_blank" class="ver-producto">🔗 Ver producto</a>
        </div>
      `;
    });

    res.json({ respuesta: mensaje });
  } catch (error) {
    console.error("Error en la búsqueda:", error.message);
    res.status(500).json({ respuesta: "Error al obtener resultados. Intenta nuevamente más tarde." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
