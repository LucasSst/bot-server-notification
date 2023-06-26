const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription("Avisará que o servidor está online!"),

    async execute(interaction) {
        interaction.reply(`Servidor Online! @here.`)
    }
}