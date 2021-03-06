const { Client, Intents } = require('discord.js');
const fetch = require("node-fetch")
const keepAlive = require("./server")
const Database = require("@replit/database")
const { createClient } = require('@supabase/supabase-js');

const db = new Database()
const client = new Client({ 
  intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MEMBERS],
  partials: ['MESSAGE', 'REACTION', 'CHANNEL']
});

const supabaseUrl = process.env['SUPABASE_URL']
const supabaseAnonKey = process.env["SUPABASE_ANON_KEY"]
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const GILD_DAO_ROLE = "Gild DAO"

async function registerMember() {
// register member discord + public wallet
const { data, error } = await supabase
  .from('guild_member')
  .insert(
    { id: '123423', wallet_key: "12312", guild_id: '12364' }
  );

// Fetch members by guild id
// used on frontend for adding wallets, distributing coins
  // const { data, error } = await supabase
  //   .from('guild_member')
  //   .select()
  //   .eq('guild_id', "123")

  // console.log('Inserting into supabase', data, error);
};

// 1. On ready, create new channel
// 2. Bot posts URL link for guild users to add wallet/ sign up for DAO
// 3. After DAO creation, post another message in channel with emoji for getting DAO role in discord server

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

function getGuilds(msg) {
  return msg.guild.members.cache;
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


// Temp for testing
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

  if (msg.content.startsWith("$getGuilds")) {
    msg.channel.send(`Getting Guilds.`);
    getGuilds(msg);
  } 

  if (msg.content.startsWith("$createChannel")) {
    msg.guild.channels.create('bot-channel-create', 
      { reason: 'Channel for bot to manage DAO in discord.' }
    ).then(console.log)
     .catch(console.error);
  } 
});


// WORKS HYPE
client.on('guildCreate', async (guild) => {
  try {
   await guild.channels.create('bot-channel-create', 
      { reason: 'Channel for bot to manage DAO in discord.' }
    );
  } catch(error) {
    console.log('error:', error);
  }

});

// TODO: Add roles on reaction after checking if they are authenticated w/ wallet
// https://www.smashingmagazine.com/2021/02/building-discord-bot-discordjs/
client.on('messageReactionAdd', async (reaction, user) => {});

// Make call to our DAO service to see if users wallet has correct tokens
function checkIfUserInDAO (interaction) {}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

keepAlive()
client.login(process.env['DISCORD_SECRET_KEY'])