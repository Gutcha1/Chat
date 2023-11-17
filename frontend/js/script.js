const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
];

const user = { id: "", name: "", color: "" };
let websocket;

const createMessageElement = (content, sender, senderColor, isSelf) => {
    const div = document.createElement("div");
    const span = document.createElement("span");

    div.classList.add(isSelf ? "message--self" : "message--other");
    span.classList.add("message--sender");
    span.style.color = senderColor;

    div.appendChild(span);

    span.innerHTML = sender;
    div.innerHTML += content;

    return div;
};

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
};

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data);
    const isSelf = userId === user.id;

    const message = createMessageElement(content, userName, userColor, isSelf);

    chatMessages.appendChild(message);
    scrollScreen();
};

const handleWebSocketError = (error) => {
    console.error("Erro na conexão WebSocket:", error);
};

const handleWebSocketClose = () => {
    console.warn("Conexão WebSocket fechada.");
    // Adicione lógica adicional, se necessário.
};

const handleUnload = () => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.close();
    }
};

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();

    login.style.display = "none";
    chat.style.display = "flex";

    websocket = new WebSocket("ws://localhost:8080");
    websocket.onmessage = processMessage;
    websocket.onerror = handleWebSocketError;
    websocket.onclose = handleWebSocketClose;
});

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (websocket && websocket.readyState === WebSocket.OPEN) {
        const message = {
            userId: user.id,
            userName: user.name,
            userColor: user.color,
            content: chatInput.value
        };

        websocket.send(JSON.stringify(message));
        chatInput.value = "";
    } else {
        console.error("WebSocket não está aberto. Tente reconectar.");
    }
});

window.addEventListener("beforeunload", handleUnload);
