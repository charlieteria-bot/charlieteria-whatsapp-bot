const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('Escanea el QR con tu WhatsApp Business');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('🤖 Bot de La Charlietería listo!');
});

client.on('message', async message => {

    const msg = message.body.toLowerCase();

    if (msg === "hola" || msg === "menu" || msg === "menú") {

        client.sendMessage(message.from, `🍖 Bienvenido a La Charlietería

1️⃣ Ver menú
2️⃣ Ver catálogo
3️⃣ Hacer pedido
4️⃣ Hablar con asesor`);
    }

    if (msg === "1") {

        client.sendMessage(message.from, `🍽 Nuestro menú

🥩 Choripán
🌭 Chorizo artesanal
🍔 Hamburguesas

Escribe *3* para hacer tu pedido.`);
    }

    if (msg === "2") {

        client.sendMessage(message.from, `📄 Aquí puedes ver nuestro catálogo

https://TU_LINK_DEL_PDF`);
    }

    if (msg === "3") {

        client.sendMessage(message.from, `📝 Envíanos tu pedido así:

Nombre:
Dirección:
Producto:`);

        const admin = "573219434866@c.us";

        client.sendMessage(admin, "📢 Nuevo pedido recibido en La Charlietería");
    }

    if (msg === "4") {

        client.sendMessage(message.from, `👨‍💼 Un asesor te responderá pronto.`);
    }

});

client.initialize();
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: '/usr/bin/chromium',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});
