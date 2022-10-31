const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Get the list of current commands."),
  options: "",
  async execute(interaction, args, client) {
    let helpDesc = `These are the current commands available for use!`;

    client.commands.forEach((value, key) => {
      if (key != "help") helpDesc += `\n\n **/${key}** ${value.options} \n ${value.data.description}`;
    });

    let embed = new Discord.MessageEmbed()
      .setTitle("Help | Active Commands")
      .setDescription(helpDesc)
      .setFooter({
        text: "Created with ❤️ by ben#0673",
      })
      .setColor(botconfig.COLOR_SCHEME)
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
