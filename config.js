module.exports = {
    token: "XXXXXXXXXXX", // Token do seu bot.

    clientsecret: "XXXXX", // ClientSecret do seu bot.
    clientid: "XXXXXXXX", // Id do seu bot
    url: "XX", // Url do seu site sem os https://.

    api: {
        dbl: "XXXX" // https://discordbots.org/api/docs#mybots // Pegando o key da api.
    },

    vote: {
        port: 5000, // Porta da dbl
        password: "XXXXXXXXXXX" // Password do bot dbl
    },

    bot: {
        botname: "XXXX", // Nome do bot
        botlogolink: "XXXXXXX", // Logo do bot em link.
        botdescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", // Descrição do bot.
        creatorname: "XXXXX#0000", // Nome do criador com tag.
        creatorid: "XXXXX", // Id do criador
        supportserverinvite: "XXXXXXXX", // Convite do server de suporte
        botinvitelink: "XXXXXXXXXXXXXXXXXX", // Convite do bot.
        prefix: "XX", // Prefixo do bot.
        language: "XXXXX" // Lingua do bot.
    },

    path: {
        "commands": "./commands",
        "events": "./events"
    }
};
