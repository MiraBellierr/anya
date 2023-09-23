require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const { getAnimeNews } = require("./util/getNews");
const intents = [];
const { JsonDB, Config } = require("node-json-db");

Object.keys(Discord.IntentsBitField.Flags).forEach((intent) => {
	intents.push(intent);
});

const client = new Discord.Client({
	intents,
});

const db = new JsonDB(new Config("news", true, true, "/"));

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.voiceChannels = new Discord.Collection();
client.categories = fs.readdirSync("src/commands/");

["command", "event"].forEach((handler) => {
	require(`./handler/${handler}`)(client);
});

getAnimeNews(client, db);

setInterval(() => {
	getAnimeNews(client, db);
}, 60000);

client.login(process.env.TOKEN);
