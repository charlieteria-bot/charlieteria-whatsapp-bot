const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('Escanea el QR');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot listo 🚀');
});

client.on('message', async msg => {

    const text = msg.body.toLowerCase();

    if(text === "hola"){
        msg.reply(`🍖 Bienvenido a La Charlietería

1️⃣ Ver menú
2️⃣ Ver catálogo
3️⃣ Hacer pedido
4️⃣ Hablar con asesor`);
    }

});

client.initialize();
