const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.API_TOKEN, {
  polling: true,
});

// Set up webhook
bot.setWebHook(`${process.env.BASE_URL}/telegram/${process.env.API_TOKEN}`);

// Create a Map object to store user data
const users = new Map();

const sendTheMessageToGroup = (msg, groupChatId) => {
  const feedback = `Message from: ${msg.from.first_name} -- id: ${msg.from.id}\n\n${msg.text}`;
  const chatId = users.get(msg.from.id).chatId;

  bot
    .sendMessage(groupChatId, feedback)
    .then(() => {
      bot.sendMessage(
        chatId,
        "✅ Your message has been received.\nThank you for reaching out to us. Our team will review your feedback and take any necessary actions.\n🚀 To send another message, please click on /start."
      );
    })
    .catch((error) => {
      console.error(error);
    });

  // Remove the user from the users map
  users.delete(msg.from.id);
};

const handleSpamBlock = () => {
  const createRandomNumber = (num) => Math.floor(Math.random() * num);

  const numberOne = createRandomNumber(100);
  const numberTwo = createRandomNumber(100);

  const result = numberOne + numberTwo;

  const message = `⭕ What is the result of the equation ${numberOne} + ${numberTwo}?`;

  const randomOption = () => {
    switch (createRandomNumber(3)) {
      case 0:
        return [
          [{ text: `1️⃣ ${result}`, callback_data: "true" }],
          [{ text: `2️⃣ ${createRandomNumber(150)}`, callback_data: "false" }],
          [{ text: `3️⃣ ${createRandomNumber(150)}`, callback_data: "false" }],
        ];
      case 1:
        return [
          [{ text: `1️⃣ ${createRandomNumber(150)}`, callback_data: "false" }],
          [{ text: `2️⃣ ${result}`, callback_data: "true" }],
          [{ text: `3️⃣ ${createRandomNumber(150)}`, callback_data: "false" }],
        ];
      case 2:
        return [
          [{ text: `1️⃣ ${createRandomNumber(150)}`, callback_data: "false" }],
          [{ text: `2️⃣ ${createRandomNumber(150)}`, callback_data: "false" }],
          [{ text: `3️⃣ ${result}`, callback_data: "true" }],
        ];
    }
  };

  const options = {
    reply_markup: {
      inline_keyboard: randomOption(),
    },
  };

  const spamBlockData = { message, options };

  return spamBlockData;
};

bot.onText(/\/start/, async (msg) => {
  const spamBlockData = await handleSpamBlock();
  bot.sendMessage(msg.chat.id, spamBlockData.message, spamBlockData.options);
});

bot.on("callback_query", (query) => {
  const queryChatId = query.message.chat.id;
  const queryMessage = query.data;

  const options = {
    reply_markup: {
      keyboard: [["🗳 Feedback", "🎓 Mentors"], ["📚 Homework", "🧬 Management"], ["💡 Suggestion", "🛠 Criticism"], ["🚫 Stop"]],
      resize_keyboard: true,
      one_time_keyboard: true,
      force_reply: true,
    },
  };

  if (queryMessage === "false") {
    bot.sendMessage(queryChatId, "⚠️ The option you have chosen is wrong!!");
  } else if (queryMessage === "true") {
    bot.sendMessage(queryChatId, "⌨️ Please select an option from the keyboard below:", options).catch((error) => {
      console.log(`Error occurred while sending message: ${error}`);
    });

    bot.on("message", (msg) => {
      if (msg.text === "🗳 Feedback") {
        bot.sendMessage(msg.chat.id, "✒️ Please enter your feedback:", options).then(() => {
          // Save the selected option and chat ID to the users map
          users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
        });
      } else if (users.has(msg.from.id) && users.get(msg.from.id).option === "🗳 Feedback") {
        sendTheMessageToGroup(msg, "-1001733809963");
      } else if (msg.text === "🎓 Mentors") {
        bot.sendMessage(msg.chat.id, "✒️ Please enter your message to mentors:", options).then(() => {
          // Save the selected option and chat ID to the users map
          users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
        });
      } else if (users.has(msg.from.id) && users.get(msg.from.id).option === "🎓 Mentors") {
        sendTheMessageToGroup(msg, "-1001962711620");
      } else if (msg.text === "📚 Homework") {
        bot.sendMessage(msg.chat.id, "✒️ Please enter your message about your homework:", options).then(() => {
          // Save the selected option and chat ID to the users map
          users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
        });
      } else if (users.has(msg.from.id) && users.get(msg.from.id).option === "📚 Homework") {
        sendTheMessageToGroup(msg, "-1001774820539");
      } else if (msg.text === "🧬 Management") {
        bot.sendMessage(msg.chat.id, "✒️ Please enter your message to the management team:", options).then(() => {
          // Save the selected option and chat ID to the users map
          users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
        });
      } else if (users.has(msg.from.id) && users.get(msg.from.id).option === "🧬 Management") {
        sendTheMessageToGroup(msg, "-1001590350821");
      } else if (msg.text === "💡 Suggestion") {
        bot
          .sendMessage(msg.chat.id, "✒️ Please enter your suggestion:", options)
          .then(() => {
            // Save the selected option and chat ID to the users map
            users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
          })
          .catch((error) => {
            console.log(`Error occurred while sending message: ${error}`);
          });
      } else if (users.has(msg.from.id) && users.get(msg.from.id).option === "💡 Suggestion") {
        sendTheMessageToGroup(msg, "-1001733809963");
      } else if (msg.text === "🛠 Criticism") {
        bot
          .sendMessage(msg.chat.id, "✒️ Please enter your criticism:", options)
          .then(() => {
            // Save the selected option and chat ID to the users map
            users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
          })
          .catch((error) => {
            console.log(`Error occurred while sending message: ${error}`);
          });
      } else if (users.has(msg.from.id) && users.get(msg.from.id).option === "🛠 Criticism") {
        sendTheMessageToGroup(msg, "-1001733809963");
      } else if (msg.text === "🚫 Stop") {
        bot.sendMessage("Goodbye dear friend 👋", {
          reply_markup: {
            remove_keyboard: true,
          },
        });
      } else {
        bot.sendMessage(msg.chat.id, "⌨️ Please select an option from the keyboard below:", options).catch((error) => {
          console.log(`Error occurred while sending message: ${error}`);
        });
      }
    });
  }
});

module.exports = bot;
