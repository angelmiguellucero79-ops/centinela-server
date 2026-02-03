const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// IMPORTANTE: Esta clave debe ser IGUAL a la que tienes en tu ESP32
const SECRET_KEY = "CENTINELA_SECURE_KEY"; 

app.post('/api/data', (req, res) => {
    const signature = req.headers['x-signature'];
    const payload = JSON.stringify(req.body);

    // Recreamos la firma para verificar que los datos son reales
    const expectedSignature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(payload)
        .digest('hex');

    if (signature === expectedSignature) {
        console.log("--- Datos auténticos recibidos ---");
        console.table(req.body); 
        res.status(200).send("OK - Recibido por Centinela");
    } else {
        console.error("ALERTA: Firma inválida. Petición rechazada.");
        res.status(401).send("No autorizado");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
