const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.SERPAPI_KEY || "TU_API_KEY";

app.use(cors());
app.use(express.static("public"));

// Ferreterías locales de Antofagasta
const ferreteriasLocales = [
  "Construmart", "Sodimac", "Easy", "Ferretería Prat", 
  "Ferretería San Carlos", "Planchacor", "Ferretería Antofagasta"
];

// Productos predefinidos (respaldo)
const productosRespaldo = [
  {
    title: "Cemento Melón 25 kg",
    price: "$12.990",
    source: "Construmart Antofagasta",
    link: "https://www.construmart.cl/cemento-melon"
  },
  {
    title: "Cemento Polpaico 25 kg",
    price: "$11.500",
    source: "Sodimac Antofagasta",
    link: "https://sodimac.falabella.com/cemento-polpaico"
  }
];

// Función para limpiar y preparar la consulta
function prepararConsulta(query) {
  // Eliminar palabras comunes y números innecesarios
  const palabrasIgnorar = ["de", "en", "kg", "kilos", "saco"];
  return query
    .toLowerCase()
    .split(" ")
    .filter(palabra => !palabrasIgnorar.includes(palabra) && !/^\d+$/.test(palabra))
    .join(" ");
}

app.get("/buscar", async (req, res) => {
  let consulta = req.query.q || "";

  // Limpiar la consulta
  const consultaLimpia = prepararConsulta(consulta);

  try {
    // Buscar en Google Shopping
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_shopping",
        q: `${consultaLimpia} Antofagasta`,
        hl: "es",
        gl: "cl",
        location: "Antofagasta, Chile",
        api_key: apiKey
      }
    });

    // Filtrar resultados
    let resultados = (response.data.shopping_results || [])
      .filter(item => 
        ferreteriasLocales.some(tienda => 
          item.source.toLowerCase().includes(tienda.toLowerCase())
      )
      .filter(item => 
        item.title.toLowerCase().includes(consultaLimpia)
      );

    // Si no hay resultados, usar el respaldo
    if (resultados.length === 0) {
      resultados = productosRespaldo.filter(item =>
        item.title.toLowerCase().includes(consultaLimpia)
      );
    }

    // Construir respuesta
    let mensaje = "";
    if (resultados.length > 0) {
      mensaje = `
        <strong>Resultados en Antofagasta:</strong><br>
        ${resultados.slice(0, 5).map(item => `
          <div class="producto">
            <p><strong>${item.title}</strong></p>
            <p>💰 ${item.price} | 🏪 ${item.source}</p>
            <a href="${item.link}" target="_blank" class="ver-producto">Ver producto</a>
          </div>
        `).join("")}
      `;
    } else {
      mensaje = `
        <p>😕 No encontramos resultados exactos. Prueba con:</p>
        <ul class="sugerencias">
          <li>"Cemento 25 kg"</li>
          <li>"Clavos 2 pulgadas"</li>
          <li>"Pintura exterior"</li>
        </ul>
      `;
    }

    res.json({ respuesta: mensaje });

  } catch (error) {
    res.json({ 
      respuesta: `
        <p>⚠️ Error temporal. Estos son productos comunes en Antofagasta:</p>
        ${productosRespaldo.map(item => `
          <div class="producto">
            <p><strong>${item.title}</strong> (${item.price})</p>
          </div>
        `).join("")}
      `
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor activo en http://localhost:${port}`);
});
