class Command {
    /**
     * @param {Hiroshi} client The client used in the command 
     * @param {Object} options The command's configuration
     */
    constructor(client, options) {
        /**
         * The client used in the command
         * @type {Hiroshi}
         */
        this.client = client;
        /**
         * The command's information properties
         * @type {Object}
         */
        this.help = {
          name: options.name || null,
          category: options.category || "Other",
          enabled: true || false,
          aliases: options.aliases || [],
          owner: options.owner
        };
    };
    setMessage(message) {
        this.message = message;
    }
}

module.exports = Command;
