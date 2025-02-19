const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const SERP_API_KEY = "4cb96a3a5032bf3d519eb1b6a1c0082ecc6b151b318d99531e7bda504f177e92";

app.use(express.static("public"));

app.get("/buscar", async (req, res) => {
  const query = req.query.query + " Antofagasta";

  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        q: query,
        location: "Antofagasta, Chile",
        hl: "es",
        gl: "cl",
        api_key: SERP_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener resultados" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
