const express = require("express");
const fetch = require("node-fetch");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/buscar", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.json({ respuesta: "Por favor, ingresa un término de búsqueda." });
  }

  try {
    const apiKey = "TU_SERPAPI_KEY"; // Asegúrate de que esta clave sea válida
    const searchUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(query + " Antofagasta")}&hl=es&gl=cl&api_key=${apiKey}`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.shopping_results || data.shopping_results.length === 0) {
      return res.json({ respuesta: "No se encontraron productos en tiendas específicas de Antofagasta." });
    }

    let resultados = data.shopping_results.filter(item =>
      item.source.toLowerCase().includes("antofagasta") || 
      item.title.toLowerCase().includes("antofagasta")
    );

    if (resultados.length === 0) {
      return res.json({ respuesta: "No se encontraron productos en tiendas específicas de Antofagasta." });
    }

    let mensaje = "<strong>Resultados encontrados:</strong><br>";
    resultados.slice(0, 5).forEach((item) => {
      mensaje += `<div class="producto">
        <p><strong>${item.title}</strong></p>
        <p>💰 Precio: <span class="precio">${item.price}</span></p>
        <p>🏪 Tienda: ${item.source} ✅ (Antofagasta)</p>
        <a href="${item.link}" target="_blank" class="ver-producto">🔗 Ver producto</a>
      </div>`;
    });

    res.json({ respuesta: mensaje });
  } catch (error) {
    res.json({ respuesta: "Error al obtener resultados. Inténtalo más tarde." });
  }
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
