<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cotizador de Materiales - Antofagasta</title>
    <style>
      /* Reset global */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: black;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        position: relative;
        text-align: center;
        padding-bottom: 100px; /* Deja espacio para el footer */
        margin-bottom: 0; /* Evita margen extra al fondo */
      }

      /* Fondo con logo en opacidad ajustada */
      body::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url("https://github.com/OrumST/cotizador-enr/raw/refs/heads/main/public/logo") no-repeat center center;
        background-size: contain;
        opacity: 0.2;
        z-index: -1;
      }

      /* HEADER */
      .header {
        width: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        padding: 15px 0;
        text-align: center;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        border-bottom: 1px solid #444;
      }

      .header nav a {
        color: white;
        text-decoration: none;
        margin: 0 15px;
        font-size: 18px;
        font-weight: bold;
        transition: color 0.3s, transform 0.2s;
      }

      .header nav a:hover {
        color: #4CAF50;
        transform: scale(1.1);
      }

      /* Contenedor principal centrado y responsivo */
      .contenedor {
        background-color: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        width: 90%;
        margin-top: 220px; /* Posicionado a 220px del header */
        text-align: center;
        animation: fadeIn 1s ease-in-out;
        z-index: 5; /* Asegura que el contenedor se mantenga sobre el fondo */
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }

      h1 {
        font-size: 24px;
        color: #333;
        margin-bottom: 20px;
        text-align: center;
      }

      #user-input {
        width: calc(100% - 24px);
        padding: 12px;
        margin-bottom: 16px;
        border-radius: 8px;
        border: 1px solid #ccc;
        font-size: 16px;
        text-align: center;
      }

      #user-input::placeholder {
        text-align: center;
      }

      button {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 12px;
        width: 100%;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.2s, background-color 0.2s;
        font-size: 16px;
        font-weight: bold;
      }

      button:hover {
        transform: scale(1.05);
        background-color: #45a049;
      }

      #chat-box {
        margin-top: 16px;
      }

      .producto {
        background-color: #fafafa;
        border: 1px solid #ddd;
        padding: 8px;
        border-radius: 8px;
        margin-top: 8px;
      }

      .precio {
        color: green;
        font-weight: bold;
      }

      .ver-producto {
        display: inline-block;
        margin-top: 4px;
        text-decoration: none;
        color: #1a73e8;
      }

      .ver-producto:hover {
        text-decoration: underline;
      }

      /* Ajustes responsivos */
      @media (max-width: 600px) {
        .contenedor {
          padding: 20px;
          margin-top: 150px; /* Ajuste menor en pantallas pequeñas */
        }
        h1 {
          font-size: 20px;
          margin-bottom: 16px;
        }
        #user-input {
          font-size: 14px;
          padding: 10px;
        }
        button {
          font-size: 14px;
          padding: 10px;
        }
      }

      /* FOOTER */
      footer {
        width: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        text-align: center;
        padding: 20px;
        position: absolute;
        bottom: 0;
        z-index: 1; /* Asegura que el footer esté sobre el fondo */
      }

      footer p {
        margin: 8px 0;
      }

      .footer-socials {
        display: flex;
        justify-content: center;
        margin-top: 10px;
      }

      .footer-socials a {
        color: white;
        text-decoration: none;
        margin: 0 15px;
        font-size: 20px;
        transition: color 0.3s;
      }

      .footer-socials a:hover {
        color: #4CAF50;
      }
    </style>
  </head>
  <body>
    <!-- HEADER -->
    <header class="header">
      <nav class="nav">
        <a href="#" onclick="window.location.reload(); return false;">Inicio</a>
        <a href="#">Contacto</a>
      </nav>
    </header>

    <!-- Contenedor principal -->
    <div class="contenedor">
      <h1>🛒 Cotizador de Materiales en Antofagasta</h1>
      <input type="text" id="user-input" placeholder="¿Qué material necesitas? (Ejemplo: Saco de cemento 25KG)" />
      <button onclick="sendMessage()">Buscar Precios</button>
      <div id="chat-box"></div>
    </div>

    <!-- FOOTER -->
    <footer>
      <p><strong>ENR</strong> - Cotizador de Materiales</p>
      <p>Dirección: Baquedano Nª50 Oficina N°709, Antofagasta, Chile</p>
      <p>Contacto: <a href="mailto:enrservicios@outlook.es">enrservicios@outlook.es</a> | Tel: 958576799</p>
      <div class="footer-socials">
        <a href="https://www.instagram.com/enr.oficial_/" target="_blank">
          <img src="https://github.com/OrumST/cotizador-enr/raw/refs/heads/main/assets/15707869.png" alt="Instagram" width="30" height="30" />
        </a>
        <a href="https://www.facebook.com/profile.php?id=61573129205817" target="_blank">
          <img src="https://github.com/OrumST/cotizador-enr/raw/refs/heads/main/assets/124010.png" alt="Facebook" width="30" height="30" />
        </a>
      </div>
    </footer>

    <script>
      async function sendMessage() {
        const userInput = document.getElementById('user-input').value;
        const chatBox = document.getElementById('chat-box');

        if (userInput.trim() === '') return;

        chatBox.innerHTML = '<p><strong>Buscando...</strong></p>';

        try {
          const response = await fetch(`/buscar?q=${encodeURIComponent(userInput)}`);
          const data = await response.json();

          chatBox.innerHTML = `<div>${data.respuesta}</div>`;
        } catch (error) {
          chatBox.innerHTML = `<p><strong>Error:</strong> No se pudo obtener respuesta.</p>`;
          console.error("Error en la petición:", error);
        }
      }
    </script>
  </body>
</html>
