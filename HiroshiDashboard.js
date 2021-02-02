module.exports.load = async (client) => {

    const express = require('express'),
        session = require('express-session'),
        bodyParser = require('body-parser'),
        firebase = require("firebase"),
        path = require("path"),
        Discord = require("discord.js"),
        flash = require("connect-flash"),
        passport = require('passport'),
        Strategy = require('./lib/strategy.js').Strategy,
        cookieParser = require("cookie-parser"),
        router = express(),
        port = process.env.PORT || 50000,
        {
            checkAuth
        } = require('./utils/checkAuth.js'),
        dependencias = {
            botavatar: client.config.bot.botavatarlink,
            botname: client.config.bot.botname,
            botdescription: client.config.bot.botdescription,
            creatorname: client.config.bot.creatorname,
            creatorid: client.config.bot.creatorid,
            creatoravatarlink: client.config.bot.creatoravatarlink,
            supportserverinvite: client.config.bot.supportserverinvite,
            botinvitelink: client.config.bot.botinvitelink,
            botlogolink: client.config.bot.botlogolink,
            prefix: client.config.bot.prefix,
            language: client.config.bot.language
        };

    router.use(session({
        secret: 'youshallnotpass',
        resave: false,
        saveUninitialized: false
    }));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    const scopes = ['identify', 'guilds'];

    passport.use(new Strategy({
        clientID: client.config.clientid,
        clientSecret: client.config.clientsecret,
        callbackURL: "https://" + client.config.url + "/callback",
        scope: scopes
    }, function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }));

    router.use(passport.initialize());

    router.use(passport.session())

    router
        .use(express.static("public"))
        .use(express.json())
        .use(express.urlencoded({
            extended: true
        }))
        .engine("html", require("ejs").renderFile)
        .set("view engine", "ejs")
        .set("views", path.join(__dirname, "/views"))
        .set("port", 3000)
        .use(cookieParser())
        .use(flash());

    router.get('/login', async function (req, res) {
        return res.redirect("https://discord.com/api/oauth2/authorize?client_id=" + client.config.clientid + "&redirect_uri=https%3A%2F%2F" + client.config.url + "%2Fcallback&response_type=code&scope=identify%20guilds")
    });
    router.get('/login/features', async function (req, res) {
        return res.redirect("https://discord.com/api/oauth2/authorize?client_id=" + client.config.clientid + "&redirect_uri=https%3A%2F%2F" + client.config.url + "%2Ffeatures&response_type=code&scope=identify%20guilds")
    })
    router.get('/login/about', async function (req, res) {
        return res.redirect("https://discord.com/api/oauth2/authorize?client_id=" + client.config.clientid + "&redirect_uri=https%3A%2F%2F" + client.config.url + "%2Fabout&response_type=code&scope=identify%20guilds")
    })
    router.get('/login/commands', async function (req, res) {
        return res.redirect("https://discord.com/api/oauth2/authorize?client_id=" + client.config.clientid + "&redirect_uri=https%3A%2F%2F" + client.config.url + "%2Fcommands&response_type=code&scope=identify%20guilds")
    })
    router.get('/login/dashboard', async function (req, res) {
        return res.redirect('https://discord.com/api/oauth2/authorize?client_id="+client.config.clientid+"&redirect_uri=https%3A%2F%2F"+client.config.url+"%2Fcallback&response_type=code&scope=identify%20guilds')
    })
    router.get('/invite', async function (req, res) {
        return res.redirect("https://discord.com/api/oauth2/authorize?client_id=" + client.config.clientid + "&permissions=8&redirect_uri=https%3A%2F%2F" + client.config.url + "%2Fcallback&response_type=code&scope=identify%20guilds%20bot");
    })
    router.get('/logout', async function (req, res) {
        res.oauth.logout();
        return res.redirect('/')
    })
    router.get('/callback', passport.authenticate('discord', {
        failureRedirect: '/'
    }), function (req, res) {
        res.redirect('/dashboard')
    });

    router.get('/', async function (req, res) {
        res.render('index.ejs', {
            dependencias,
            logged: req.user ? true : false,
            user: req.user || null,
            avatar: req.user ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}` : '',
            client,
            user: req.user || null
        })
    });

    router.get('/documentation', function (req, res) {
        res.render('docs.ejs', {
            dependencias,
            user: req.user || null,
            client,
            user: req.user || null
        })
    })

    router.get('/features', async function (req, res) {
        res.render('features.ejs', {
            dependencias,
            user: req.user || null,
            client,
            user: req.user || null
        })
    });

    router.get('/about', async function (req, res) {
        res.render('about.ejs', {
            dependencias,
            user: req.user || null
        })
    });

    router.get('/commands', async function (req, res) {
        const arraycommands = await client.commands.array().filter(ch => ch.help.category !== 'Owner' || ch.help.enabled === false);

        res.render('commands.ejs', {
            dependencias,
            client,
            commands: arraycommands,
            user: req.user || null
        })
    });

    router.get('/dashboard', async function (req, res) {
        res.render('dashboard.ejs', {
            dependencias,
            logged: req.user ? true : false,
            username: req.user ? req.user.username : '',
            avatar: req.user ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}` : '',
            guilds: req.user ? req.user.guilds.filter(guild => guild.owner) : [],
            client,
            user: req.user || null
        })
    });

    router.get('/dashboard/:guildID', checkAuth, async function (req, res) {
        let guild = client.guilds.cache.get(req.params.guildID)
        if (!guild) {
            return res.redirect(`https://discord.com/api/oauth2/authorize?client_id="+client.config.clientid+"&permissions=8&redirect_uri=https%3A%2F%2F"+client.config.url+"%2F&scope=bot&guild_id=${req.params.guildID}`)
        }

        let prefix = await client.Database.ref(`Servidores/Prefix/${req.params.guildID}/prefix`).once('value')
        let antiinvite = await client.Database.ref(`Servidores/Invite/${req.params.guildID}/invite`).once('value')
        prefix = prefix.val()
        antiinvite = antiinvite.val()

        if (!prefix) prefix = 'h!'
        if (!antiinvite) antiinvite = 'Não'

        res.render('guilds.ejs', {
            dependencias,
            logged: req.user ? true : false,
            username: req.user ? req.user.username : '',
            avatar: req.user ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}` : '',
            guilds: guild ? guild : {},
            user: req.user || null,
            prefix: prefix,
            antiinvite: antiinvite
        })
    });

    router.get("/style.css", (request, response) => {
        response.sendFile(__dirname + "/style.css")
    });
    router.get("/css/bootstrap.min.css", (request, response) => {
        response.sendFile(__dirname + "/css/bootstrap.min.css")
    });
    router.get("/css/now-ui-kit.css", (request, response) => {
        response.sendFile(__dirname + "/css/now-ui-kit.css")
    });
    router.get("/js/loader", (request, response) => {
        response.sendFile(__dirname + "/js/loader.js")
    });


    router.post('/dashboard/:guildID/save/prefix', checkAuth, async (req, res) => { // Post Prefix
        let guild = client.guilds.cache.get(req.params.guildID)
        if (!guild) {
            return res.redirect(`https://discord.com/api/oauth2/authorize?client_id="+client.config.clientid+"&permissions=8&redirect_uri=https%3A%2F%2F"+client.config.url+"%2F&scope=bot&guild_id=${req.params.guildID}`)
        }

        let dados = req.params.guildID;

        let bref = client.Database.ref(`Servidores/Prefix/${dados}`)
        bref.update({
            prefix: req.body.prefix
        })
        res.redirect(`/dashboard/${dados}`)
    })

    router.post('/dashboard/:guildID/save/antiinvite', checkAuth, async (req, res) => { // Post Anti-invite
        let guild = client.guilds.cache.get(req.params.guildID)
        if (!guild) {
            return res.redirect(`https://discord.com/api/oauth2/authorize?client_id="+client.config.clientid+"&permissions=8&redirect_uri=https%3A%2F%2F"+client.config.url+"%2F&scope=bot&guild_id=${req.params.guildID}`)
        }

        let dados = req.params.guildID;

        let bref = client.Database.ref(`Servidores/Invite/${dados}`)
        bref.update({
            invite: req.body.antiinvite
        })
        res.redirect(`/dashboard/${dados}`)
    })

    router.post('/dashboard/:guildID/save/punishchannel', checkAuth, async (req, res) => { // Post Punishchannel
        let guild = client.guilds.cache.get(req.params.guildID)
        if (!guild) {
            return res.redirect(`https://discord.com/api/oauth2/authorize?client_id="+client.config.clientid+"&permissions=8&redirect_uri=https%3A%2F%2F"+client.config.url+"%2F&scope=bot&guild_id=${req.params.guildID}`)
        }

        let dados = req.params.guildID;

        let bref = client.Database.ref(`Servidores/PunishChannels/${dados}`)
        bref.update({
            channel: req.body.punishchannel
        })
        res.redirect(`/dashboard/${dados}`)
    })

    router.post('/dashboard/:guildID/save/autorole', checkAuth, async (req, res) => { // Post Autorole
        let guild = client.guilds.cache.get(req.params.guildID)
        if (!guild) {
            return res.redirect(`https://discord.com/api/oauth2/authorize?client_id="+client.config.clientid+"&permissions=8&redirect_uri=https%3A%2F%2F"+client.config.url+"%2F&scope=bot&guild_id=${req.params.guildID}`)
        }

        let dados = req.params.guildID;

        let bref = client.Database.ref(`Servidores/Autorole/${dados}`)
        bref.update({
            role: req.body.autorole
        })
        res.redirect(`/dashboard/${dados}`)
    })

    router.post('/dashboard/:guildID/save/muterole', checkAuth, async (req, res) => { // Post Autorole
        let guild = client.guilds.cache.get(req.params.guildID)
        if (!guild) {
            return res.redirect(`https://discord.com/api/oauth2/authorize?client_id="+client.config.clientid+"&permissions=8&redirect_uri=https%3A%2F%2F"+client.config.url+"%2F&scope=bot&guild_id=${req.params.guildID}`)
        }

        let dados = req.params.guildID;

        let bref = client.Database.ref(`Servidores/Muterole/${dados}`)
        bref.update({
            role: req.body.muterole
        })
        res.redirect(`/dashboard/${dados}`)
    })
    router.get("/host", (request, response) => {
        response.sendFile(__dirname + "/host.html")
    });
    router.listen(port)
    router.use(function (req, res) {
        res.status(404).sendFile(__dirname + "/wait/404.html")
    })
}
