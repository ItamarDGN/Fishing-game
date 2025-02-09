class GameClient {
    constructor(serverUrl) {
        this.serverUrl = serverUrl;
        this.socket = null;
        this.playerId = "player123"; // בעתיד אפשר לשנות לשם דינמי
    }

    // אתחול והתחברות לשרת
    connect() {
        this.socket = new WebSocket(this.serverUrl);

        this.socket.onopen = () => {
            console.log("🔗 Connected to WebSocket server!");
            this.sendMessage({ type: "login", player_id: this.playerId });
        };

        this.socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            console.log("📩 Server Response:", response);
            this.handleServerResponse(response);
        };

        this.socket.onerror = (error) => {
            console.error("❌ WebSocket Error:", error);
        };

        this.socket.onclose = () => {
            console.log("❌ Disconnected from server.");
        };
    }

    // שליחת הודעה לשרת בפורמט JSON
    sendMessage(messageObj) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(messageObj));
        } else {
            console.error("⚠ WebSocket is not connected.");
        }
    }

    // שליחת מיקום שחקן לשרת
    updatePlayerPosition(x, y) {
        this.sendMessage({
            type: "update_position",
            player_id: this.playerId,
            x: x,
            y: y
        });
    }

    // שליחת הודעה לתפיסת דג
    catchFish() {
        const fishData = {
            type: "catch_fish",
            player_id: this.playerId,
            fish_size: Math.floor(Math.random() * 10) + 1
        };
        this.sendMessage(fishData);
    }

    // טיפול בהודעות מהשרת
    handleServerResponse(response) {
        if (response.status === "success") {
            console.log("✅ Success:", response.message);
        } else {
            console.error("❌ Error:", response.message);
        }
    }
}

// יצירת מופע של GameClient והתחברות
const gameClient = new GameClient("ws://localhost:5000");
gameClient.connect();
