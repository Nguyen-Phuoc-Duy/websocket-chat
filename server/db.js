const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // Thay đổi nếu cần
  password: "123456", // Thay đổi nếu cần
  database: "websocket_chat",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }
  console.log("Connected to MySQL as id", connection.threadId);
});

module.exports = connection;
