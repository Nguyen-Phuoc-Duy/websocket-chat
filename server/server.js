
const WebSocket = require('ws');
const db = require('./db');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
    console.log('Client connected');

    // Gửi lịch sử tin nhắn khi kết nối
    db.query('SELECT username, message, timestamp FROM messages ORDER BY timestamp ASC', (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return;
        }
        results.forEach((row) => {
            ws.send(JSON.stringify(row));
        });
    });

    ws.on('message', (data) => {
        const messageData = JSON.parse(data);
        console.log('Received:', messageData);

        const query = 'INSERT INTO messages (username, message) VALUES (?, ?)';
        db.query(query, [messageData.username, messageData.message], (err) => {
            if (err) {
                console.error('Error saving message:', err);
                return;
            }
            // Phát tin nhắn tới tất cả các client đang kết nối
            server.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
