const { Client, Intents } = require('discord.js');
const fetch = require("node-fetch")
const keepAlive = require("./server")
const Database = require("@replit/database")

const db = new Database()
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MEMBERS] });

const GILD_DAO_ROLE = "Gild DAO"

function createGilderRole(guild) {
  guild.roles.create({
    data: {
      name: GILD_DAO_ROLE,
      permissions: [], // TODO: update this
      color: 'YELLOW',
    },
    reason: 'For people who are in gild',
  });
}

function addGilderRole (interaction) {
  console.log(interaction.guild.roles)
  var role = interaction.guild.roles.cache.find(role => role.name === GILD_DAO_ROLE);
  
  if(role) {
    interaction.member.roles.add(role); 
  } else {
     interaction.channel.send(`Role ${GILD_DAO_ROLE} does not exist. Create with $createRole`);
  }
}

client.on("message", msg => {
  if (msg.author.bot) return

  if (msg.content.startsWith("$getRole")) {
    msg.channel.send(`Adding role ${GILD_DAO_ROLE}`);
    addGilderRole(msg);
  }

  if (msg.content.startsWith("$createRole")) {
    msg.channel.send(`Creating role ${GILD_DAO_ROLE}.`);
    createGilderRole(msg.guild);
  } 
})

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

keepAlive()
client.login(process.env['DISCORD_SECRET_KEY'])