const { APIMessage, Message, Discord } = require("discord.js"),
  hiroshiDashboard = require('./HiroshiDashboard.js'),
  Hiroshi = require("./base/Hiroshi.js"),
  client = new Hiroshi();
   
client.loadEvents('./events')
client.loadCommands('./commands')

const firebase = require("firebase"),
  Sentry = require("@sentry/node"),
  util = require("util"),
  fs = require("fs"),
  readdir = util.promisify(fs.readdir),
  chalk = require("chalk");

const init = async () => {
    require("./base/Quote.js")
    hiroshiDashboard.load(client).then(() => {
      console.log(chalk.blue("⭐️・Dashboard reiniciada"))
    });
};

client.login(client.config.token)
init();

// if there is an unhandledRejection, log them
process.on("unhandledRejection", (err) => {
	console.error(err);
});
