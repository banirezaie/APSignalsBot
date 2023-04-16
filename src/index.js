const express = require("express");
require("dotenv").config();
const bot = require("./telegramBot");

const app = express();
app.use(express.json());

// Set up route to handle incoming updates from Telegram Bot API
app.post(`/telegram/${process.env.API_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Start HTTPS server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
