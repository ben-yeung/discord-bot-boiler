const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
const Discord = require("discord.js");
const botconfig = require("./botconfig.json");
const token = botconfig.TOKEN; // Discord Bot Token
const { initializeCommands } = require("./deploy");

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  if (command.permission) {
    const user = interaction.member;
    const userPerms = interaction.channel.permissionsFor(user);
    if (!userPerms || !userPerms.has(command.permission))
      return interaction.reply("You do not have the permissions to use this command :(");
  }

  try {
    await command.execute(interaction, [], client);
  } catch (error) {
    console.error(error);
  }
});

client.on("ready", async () => {
  await initializeCommands(client);

  client.user.setActivity("the world burn", {
    type: "WATCHING",
  });

  console.log(`${client.user.username} is online!`);
});

client.on("guildCreate", async (guild) => {
  console.log(`Bot added to guild ${guild.name}.`);
});

client.on("guildDelete", async (guild) => {
  console.log(`Bot removed from guild ${guild.name}.`);
});

client.login(token);
