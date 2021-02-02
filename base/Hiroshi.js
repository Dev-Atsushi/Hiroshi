const {
    Discord,
    Client,
    Collection
} = require("discord.js"),
    fs = require("fs"), {
        readdir
    } = require("fs"),
    firebase = require("firebase"),
    express = require('express'),
    session = require('express-session'), {
        GiveawaysManager
    } = require("discord-giveaways"),
    bodyParser = require('body-parser'),
    path = require("path"),
    flash = require("connect-flash"),
    cookieParser = require("cookie-parser"),
    router = express(),
    port = process.env.PORT || 5000;

var firebaseConfig = {
   // Coloque aqui a firebaseConfig.
};
firebase.initializeApp(firebaseConfig);

/** 
 * Represents a Discord client
 * @extends Discord.Client
 */

class Hiroshi extends Client {
    /**
     * @param {Object} options The options passed to the client
     * @param {Object} options.clientOptions The client options used by the original discord.js client
     * @param {Object} options.config The filepath to the config file 
     * @param {Object} options.perms The permission levels file
     */
    constructor(options = {
        clientOptions: {}
    }) {
        // Initialise discord.js client with supplied client options
        super(options.clientOptions ? options.clientOptions : {});

        this.config = require("../config.js");
        /**
         * A collection of all of the bot's commands
         * @type {Discord.Collection}
         */
        this.commands = new Collection();
        /**
         * A collection of all of the bot's command aliases
         * @type {Discord.Collection}
         */
        this.aliases = new Collection();
        // Client variables
        /**
         * The bot's configuration - empty if no file was specified
         * @type {Object}
         */
        this.config = require("../config.js")
        this.Database = firebase.database();
        this.giveawaysManager = new GiveawaysManager(this, {
            storage: "./giveaways.json",
            updateCountdownEvery: 10000,
            default: {
                botsCanWin: false,
                embedColor: "#decf28",
                reaction: "🎉"
            }
        });
    }

    /**
     * Logs the client in
     * @param {String} token The token used to log the client in 
     */
    login(token) {
        // Log super in with the specified token
        super.login(token);

        // Return this client to allow chaining of function calls
        return this;
    }

    /**
     * Loads all commands in the directory
     * @param {String} path The path where the commands are located
     */
    loadCommands(path) {
        readdir(path, (err, files) => {
            if (err) console.log(err);

            files.forEach(cmd => {
                const command = new(require(`../${path}/${cmd}`))(this);

                this.commands.set(command.help.name, command);

                command.help.aliases.forEach(a => this.aliases.set(a, command.help.name));
            });
        });
        return this;
    }

    /**
     * Loads all events in the directory
     * @param {String} path The path where the events are located
     */
    loadEvents(path) {
        readdir(path, (err, files) => {
            if (err) console.log(err);

            files.forEach(evt => {
                const event = new(require(`../${path}/${evt}`))(this);

                super.on(evt.split(".")[0], (...args) => event.run(...args));
            });
        });
        return this;
    }

    async resolveMember(search, guild) {
        let member = null;
        if (!search || typeof search !== "string") return;
        // Try ID search
        if (search.match(/^<@!?(\d+)>$/)) {
            const id = search.match(/^<@!?(\d+)>$/)[1];
            member = await guild.members.fetch(id).catch(() => {});
            if (member) return member;
        }
        // Try username search
        if (search.match(/^!?(\w+)#(\d+)$/)) {
            guild = await guild.fetch();
            member = guild.members.cache.find((m) => m.user.tag === search);
            if (member) return member;
        }
        member = await guild.members.fetch(search).catch(() => {});
        return member;
    }

    // This function is used to resolve a user from a string
    async resolveUser(search) {
        let user = null;
        if (!search || typeof search !== "string") return;
        // Try ID search
        if (search.match(/^<@!?(\d+)>$/)) {
            const id = search.match(/^<@!?(\d+)>$/)[1];
            user = this.users.fetch(id).catch(() => {});
            if (user) return user;
        }
        // Try username search
        if (search.match(/^!?(\w+)#(\d+)$/)) {
            const username = search.match(/^!?(\w+)#(\d+)$/)[0];
            const discriminator = search.match(/^!?(\w+)#(\d+)$/)[1];
            user = this.users.find((u) => u.username === username && u.discriminator === discriminator);
            if (user) return user;
        }
        user = await this.users.fetch(search).catch(() => {});
        return user;
    }
}

module.exports = Hiroshi
