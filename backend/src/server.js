const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("listening", () => {
    console.log(`WebSocket server está ouvindo na porta ${PORT}`);
});

wss.on("connection", (ws) => {
    ws.on("error", (error) => {
        console.error("Erro na conexão WebSocket:", error);
    });

    ws.on("message", (data) => {
        try {
            const message = JSON.parse(data.toString());
            // Faça alguma validação ou processamento adicional, se necessário.
            wss.clients.forEach((client) => client.send(JSON.stringify(message)));
        } catch (error) {
            console.error("Erro ao processar mensagem:", error);
        }
    });

    ws.on("close", () => {
        console.log("Cliente desconectado");
    });

    console.log("Cliente conectado");
});
