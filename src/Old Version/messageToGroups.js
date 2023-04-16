const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// Set up route to handle incoming updates from Telegram Bot API
app.post(`/telegram/${process.env.API_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

const bot = new TelegramBot(process.env.API_TOKEN, {
  polling: true,
  //   webHook: {
  //     host: `https://courageous-vestments-fawn.cyclic.app/telegram/${process.env.API_TOKEN}`,
  //   },
  //   request: {
  //     proxy: "https://t.me/proxy?server=50.7.127.174&port=443&secret=ee1603010200010001fc030386e24c3add62616c61642e6972",
  //   },
});

// Set up webhook
bot.setWebHook(`${process.env.BASE_URL}/telegram/${process.env.API_TOKEN}`);

// Start HTTPS server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});

const sendTheMessageToGroup = (msg, groupChatId) => {
  const feedback = `Message from: ${msg.from.first_name} -- id: ${msg.from.id}\n\n${msg.text}`;
  const chatId = users.get(msg.from.id).chatId;

  bot
    .sendMessage(groupChatId, feedback)
    .then(() => {
      bot.sendMessage(
        chatId,
        "Your message has been received. Thank you for reaching out to us. Our team will review your feedback and take any necessary actions. To send another message, please click on /start."
      );
    })
    .catch((error) => {
      console.error(error);
    });

  // Remove the user from the users map
  users.delete(msg.from.id);
};

// Create a Map object to store user data
const users = new Map();

const handleSpamBlock = () => {
  const SpamOptions = {};
};

const options = {
  reply_markup: {
    inline_keyboard: [[{ text: "Button 1", callback_data: "button1" }], [{ text: "Button 2", callback_data: "button2" }]],
  },
};

// bot.onText(/\/start/, (msg) => {
//   bot.sendMessage(msg.chat.id, "What is the result of the following equation?:", options);
// });

// bot.on("callback_query", (query) => {
//   const chatId = query.message.chat.id;
//   const message = query.data;

//   if (message === "button1") {
//     bot.sendMessage(chatId, "You selected Button 1.");
//   } else if (message === "button2") {
//     bot.sendMessage(chatId, "You selected Button 2.");
//   }
// });

bot.on("message", (msg) => {
  const options = {
    reply_markup: {
      keyboard: [["Feedback", "Mentors"], ["Homework", "Management"], ["Suggestion", "Criticism"], ["Stop"]],
      resize_keyboard: true,
      one_time_keyboard: true,
      force_reply: true,
    },
  };

  if (msg.text === "Feedback") {
    bot.sendMessage(msg.chat.id, "Please enter your feedback:", options).then(() => {
      // Save the selected option and chat ID to the users map
      users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
    });
  } else if (users.has(msg.from.id) && users.get(msg.from.id).option === "Feedback") {
    sendTheMessageToGroup(msg, "-1001733809963");
  } else if (msg.text === "Mentors") {
    bot.sendMessage(msg.chat.id, "Please enter your message to mentors:", options).then(() => {
      // Save the selected option and chat ID to the users map
      users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
    });
  } else if (users.has(msg.from.id) && users.get(msg.from.id).option === "Mentors") {
    sendTheMessageToGroup(msg, "-1001962711620");
  } else if (msg.text === "Homework") {
    bot.sendMessage(msg.chat.id, "Please enter your message about your homework:", options).then(() => {
      // Save the selected option and chat ID to the users map
      users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
    });
  } else if (users.has(msg.from.id) && users.get(msg.from.id).option === "Homework") {
    sendTheMessageToGroup(msg, "-1001774820539");
  } else if (msg.text === "Management") {
    bot.sendMessage(msg.chat.id, "Please enter your message to the management team:", options).then(() => {
      // Save the selected option and chat ID to the users map
      users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
    });
  } else if (users.has(msg.from.id) && users.get(msg.from.id).option === "Management") {
    sendTheMessageToGroup(msg, "-1001590350821");
  } else if (msg.text === "Suggestion") {
    bot
      .sendMessage(msg.chat.id, "Please enter your suggestion:", options)
      .then(() => {
        // Save the selected option and chat ID to the users map
        users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
      })
      .catch((error) => {
        console.log(`Error occurred while sending message: ${error}`);
      });
  } else if (users.has(msg.from.id) && users.get(msg.from.id).option === "Suggestion") {
    sendTheMessageToGroup(msg, "-1001733809963");
  } else if (msg.text === "Criticism") {
    bot
      .sendMessage(msg.chat.id, "Please enter your criticism:", options)
      .then(() => {
        // Save the selected option and chat ID to the users map
        users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
      })
      .catch((error) => {
        console.log(`Error occurred while sending message: ${error}`);
      });
  } else if (users.has(msg.from.id) && users.get(msg.from.id).option === "Criticism") {
    sendTheMessageToGroup(msg, "-1001733809963");
  } else {
    bot.sendMessage(msg.chat.id, "Please select an option from the keyboard below:", options).catch((error) => {
      console.log(`Error occurred while sending message: ${error}`);
    });
  }
});
