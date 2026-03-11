const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Servir archivos estáticos (PDF)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Token de verificación del webhook
const VERIFY_TOKEN = "charlieteria_token";

// Token de acceso de WhatsApp Cloud API
const WHATSAPP_TOKEN = "EAAulga8v3IwBQy6DvWZBxb6K23b91E4uyN80wZAjY9WLDxeAGPjEhTZCFUQx0gTl75oeqU18PWWZCMWWovVMXJpyJST9Szgc537inl2H8oz2MnJo3kPb0ZB5kg8ssiTUaR9DSWye9tlJ4hwMmdsiZClKEx2WQIsSktbG0QW9Vk0P0lL9s0VsfrCoZB4xakA4h7GxWk9wui4S2EKegHaKzjAGKyRgZBFtBDgX0nqG6zm0avWwacZBaHZBWihnGDXXZBvRlT4ADYExRg9pLmQ6WYsZAHVURAZDZD";

// Phone Number ID de tu número real
const PHONE_NUMBER_ID = "1738389286736343";

// ----------------- Manejo de usuarios en flujo de pedido -----------------
const userSessions = {}; // para manejar estado del pedido

// ----------------- WEBHOOK GET (verificación) -----------------
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verificado!');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// ----------------- WEBHOOK POST (recibir mensajes) -----------------
app.post('/webhook', (req, res) => {
    const body = req.body;
    res.sendStatus(200); // Confirmar recepción

    if (body.object) {
        body.entry.forEach(entry => {
            const changes = entry.changes;
            changes.forEach(change => {
                if (change.value.messages) {
                    const message = change.value.messages[0];
                    const from = message.from;
                    const text = message.text ? message.text.body : "";

                    handleMessage(from, text);
                }
            });
        });
    }
});

// ----------------- FUNCIONES DEL BOT -----------------
function handleMessage(from, text) {
    // Si el usuario está en flujo de pedido
    if (userSessions[from] && userSessions[from].step) {
        handleOrderStep(from, text);
        return;
    }

    // Opciones del menú
    if (text === "1") {
        sendText(from, "🍽️ Aquí está nuestro menú:\n\n- Parrilla Mixta\n- Chorizos Artesanales\n- Arepas de Carne\n- Bebidas Naturales\n\nEscribe el número de la opción que quieras.");
    } else if (text === "2") {
        sendPdf(from);
    } else if (text === "3") {
        startOrder(from);
    } else if (text === "4") {
        sendText(from, "Un asesor se pondrá en contacto contigo pronto 😊");
    } else {
        sendMenu(from);
    }
}

// ----------------- Flujo de pedido -----------------
function startOrder(user) {
    userSessions[user] = { step: "name", order: {} };
    sendText(user, "¡Perfecto! Vamos a hacer tu pedido.\n\nPor favor escribe tu *Nombre*:");
}

function handleOrderStep(user, text) {
    const session = userSessions[user];

    if (session.step === "name") {
        session.order.name = text;
        session.step = "address";
        sendText(user, "Ahora escribe tu *Dirección*:");
    } else if (session.step === "address") {
        session.order.address = text;
        session.step = "product";
        sendText(user, "Por último, escribe el *Producto* que deseas:");
    } else if (session.step === "product") {
        session.order.product = text;

        // Pedido completo
        sendText(user, `✅ Gracias por tu pedido! Aquí están los datos:\n\nNombre: ${session.order.name}\nDirección: ${session.order.address}\nProducto: ${session.order.product}\n\nNos pondremos en contacto pronto!`);

        // Guardar pedido en consola
        console.log("Nuevo pedido:", session.order);

        // Limpiar sesión
        delete userSessions[user];
    }
}

// ----------------- Funciones de envío -----------------
function sendMenu(to) {
    const data = {
        messaging_product: "whatsapp",
        to: to,
        text: {
            body: `🍖 Bienvenido a La Charlietería\n\n1️⃣ Ver menú\n2️⃣ Ver catálogo (PDF)\n3️⃣ Hacer pedido\n4️⃣ Hablar con asesor`
        }
    };

    axios.post(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, data, {
        headers: {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
}

function sendPdf(to) {
    const data = {
        messaging_product: "whatsapp",
        to: to,
        type: "document",
        document: {
            link: "https://charlieteria-bot.onrender.com/public/catalogo.pdf",
            filename: "Catalogo_La_Charlieteria.pdf"
        }
    };

    axios.post(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, data, {
        headers: {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
}

function sendText(to, message) {
    const data = {
        messaging_product: "whatsapp",
        to: to,
        text: { body: message }
    };

    axios.post(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, data, {
        headers: {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
}

// ----------------- LEVANTAR SERVIDOR -----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
