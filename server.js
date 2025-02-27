const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.SERPAPI_KEY || "4cb96a3a5032bf3d519eb1b6a1c0082ecc6b151b318d99531e7bda504f177e92";

app.use(cors());
app.use(express.static("public"));

app.get("/buscar", async (req, res) => {
  const consulta = req.query.q;
  if (!consulta) {
    return res.json({ respuesta: "Por favor, ingresa un término de búsqueda." });
  }

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
      return res.json({ respuesta: "No se encontraron productos con precios para esta búsqueda en Antofagasta." });
    }

    // Filtrar solo tiendas locales y evitar errores con undefined
    resultados = resultados.filter((item) =>
      tiendasPermitidas.some((tienda) => item.source?.toLowerCase().includes(tienda.toLowerCase()))
    );

    if (resultados.length === 0) {
      return res.json({ respuesta: "No se encontraron productos en tiendas locales de Antofagasta." });
    }

    let mensaje = "<strong>Resultados encontrados:</strong><br>";
    resultados.slice(0, 10).forEach((item) => {
      mensaje += <div class="producto">
        <p><strong>${item.title}</strong></p>
        <p>💰 Precio: <span class="precio">${item.price || "N/A"}</span></p>
        <p>🏪 Tienda: ${item.source || "No especificada"}</p>
        <a href="${item.link}" target="_blank" class="ver-producto">🔗 Ver producto</a>
      </div>;
    });

    res.json({ respuesta: mensaje });
  } catch (error) {
    console.error("Error en la búsqueda:", error.message);
    res.status(500).json({ respuesta: "Error al obtener resultados. Intenta nuevamente más tarde." });
  }
});

app.listen(port, () => {
  console.log(🚀 Servidor corriendo en http://localhost:${port});
});
