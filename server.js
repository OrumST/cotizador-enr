const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

app.get("/buscar", async (req, res) => {
  const consulta = req.query.q;
  const apiKey = "4cb96a3a5032bf3d519eb1b6a1c0082ecc6b151b318d99531e7bda504f177e92";

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

    let resultados = response.data.shopping_results;

    if (!resultados || resultados.length === 0) {
      return res.json({ respuesta: "No se encontraron productos con precios en Antofagasta." });
    }

    // Filtrar solo los que mencionan "Antofagasta" en la tienda o descripción
    resultados = resultados.filter((item) => 
      item.source.toLowerCase().includes("antofagasta") || 
      (item.title && item.title.toLowerCase().includes("antofagasta"))
    );

    if (resultados.length === 0) {
      return res.json({ respuesta: "No se encontraron resultados específicos para Antofagasta." });
    }

    let mensaje = "<strong>Resultados en Antofagasta:</strong><br>";
    resultados.slice(0, 5).forEach((item) => {
      mensaje += `<div class="producto">
        <p><strong>${item.title}</strong></p>
        <p>💰 Precio: <span class="precio">${item.price}</span></p>
        <p>🏪 Tienda: ${item.source}</p>
        <a href="${item.link}" target="_blank" class="ver-producto">🔗 Ver producto</a>
      </div>`;
    });

    res.json({ respuesta: mensaje });
  } catch (error) {
    console.error("Error en la búsqueda:", error.message);
    res.status(500).json({ respuesta: "Error al obtener resultados. Intenta nuevamente más tarde." });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
