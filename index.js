const { Client, Intents } = require('discord.js');
const fetch = require("node-fetch")
const keepAlive = require("./server")
const Database = require("@replit/database")

const db = new Database()
const client = Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MEMBERS] })

// TODO: implement add role to discord member
// const role = interaction.options.getRole('GILDDAO');
// const member = interaction.options.getMember('target');
// member.roles.add(role);

db.get("responding").then(value => {
  if (value == null) {
    db.set("responding", true)
  }
})

function getGuild() {

  return "guilds";
} 

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

keepAlive()
client.login(process.env['DISCORD_SECRET_KEY'])