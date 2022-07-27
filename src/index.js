const { Client, Intents, Collection } = require("discord.js");
const botconfig = require("./botconfig.json");
const token = botconfig.TOKEN; // Discord Bot Token
const { initializeCommands } = require("./deploy");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES],
});
client.commands = new Collection();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  if (command.permission) {
    const user = interaction.member;
    const userPerms = interaction.channel.permissionsFor(user);
    if (!userPerms || !userPerms.has(command.permission)) return interaction.reply("You do not have the permissions to use this command :(");
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
