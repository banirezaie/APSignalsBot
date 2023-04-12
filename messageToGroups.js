const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBot(process.env.API_TOKEN, { polling: true });

const sendTheMessageToGroup = (msg, groupChatId) => {
    const feedback = `Message from: ${msg.from.first_name} -- id: ${msg.from.id}\n\n${msg.text}`;
    const chatId = users.get(msg.from.id).chatId;

    bot.sendMessage(groupChatId, feedback)
        .then(() => {
            bot.sendMessage(chatId, 'Your message has been received. Thank you for reaching out to us. Our team will review your feedback and take any necessary actions. To send another message, please click on /start.');
        })
        .catch((error) => {
            console.error(error);
        });

    // Remove the user from the users map
    users.delete(msg.from.id);
}

// Create a Map object to store user data
const users = new Map();

bot.on('message', (msg) => {
    const options = {
        reply_markup: {
            keyboard: [
                ['Feedback', 'Mentors'],
                ['Homework', 'Management'],
                ['Suggestion', 'Criticism'],
                ['Stop']
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
            force_reply: true,
        },
    };

    if (msg.text === 'Feedback') {
        bot.sendMessage(msg.chat.id, 'Please enter your feedback:', options)
            .then(() => {
                // Save the selected option and chat ID to the users map
                users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
            });
    } else if (users.has(msg.from.id) && users.get(msg.from.id).option === 'Feedback') {
        sendTheMessageToGroup(msg, '-1001733809963')
    } else if (msg.text === 'Mentors') {
        bot.sendMessage(msg.chat.id, 'Please enter your message to mentors:', options)
            .then(() => {
                // Save the selected option and chat ID to the users map
                users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
            });
    } else if (users.has(msg.from.id) && users.get(msg.from.id).option === 'Mentors') {
        sendTheMessageToGroup(msg, '-1001962711620')
    } else if (msg.text === 'Homework') {
        bot.sendMessage(msg.chat.id, 'Please enter your message about your homework:', options)
            .then(() => {
                // Save the selected option and chat ID to the users map
                users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
            });
    } else if (users.has(msg.from.id) && users.get(msg.from.id).option === 'Homework') {
        sendTheMessageToGroup(msg, '-1001774820539')
    } else if (msg.text === 'Management') {
        bot.sendMessage(msg.chat.id, 'Please enter your message to the management team:', options)
            .then(() => {
                // Save the selected option and chat ID to the users map
                users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id });
            });
    } else if (users.has(msg.from.id) && users.get(msg.from.id).option === 'Management') {
        sendTheMessageToGroup(msg, '-1001590350821')
    } else if (msg.text === 'Suggestion') {
        bot.sendMessage(msg.chat.id, 'Please enter your suggestion:', options)
            .then(() => {
                // Save the selected option and chat ID to the users map
                users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id })
            })
            .catch((error) => {
                console.log(`Error occurred while sending message: ${error}`)
            })
    } else if (users.has(msg.from.id) && users.get(msg.from.id).option === 'Suggestion') {
        sendTheMessageToGroup(msg, '-1001733809963')
    } else if (msg.text === 'Criticism') {
        bot.sendMessage(msg.chat.id, 'Please enter your criticism:', options)
            .then(() => {
                // Save the selected option and chat ID to the users map
                users.set(msg.from.id, { option: msg.text, chatId: msg.chat.id })
            })
            .catch((error) => {
                console.log(`Error occurred while sending message: ${error}`)
            })
    } else if (users.has(msg.from.id) && users.get(msg.from.id).option === 'Criticism') {
        sendTheMessageToGroup(msg, '-1001733809963')
    } else {
        bot.sendMessage(msg.chat.id, 'Please select an option from the keyboard below:', options)
            .catch((error) => {
                console.log(`Error occurred while sending message: ${error}`)
            })
    }
})

