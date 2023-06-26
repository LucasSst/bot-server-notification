const { Client, Events, GatewayIntentBits, Collection, IntentsBitField } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    IntentsBitField.Flags.Guilds, 
    IntentsBitField.Flags.GuildMembers, 
    IntentsBitField.Flags.GuildMessages, 
    IntentsBitField.Flags.MessageContent] });

const dotenv = require('dotenv');

dotenv.config();
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env


const fs = require('node:fs');
const path = require('node:path');

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

client.commands = new Collection();

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command){
        client.commands.set(command.data.name , command)
    }else {
        console.log(`Esse comando em ${filePath} falhou no requimento da propriedade "data" ou no "execute"`)
    };
};

client.once(Events.ClientReady, c => {
	console.log(`Login efetuado como  ${c.user.tag}`);
});

client.login(TOKEN);

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
        console.error("Comando foi digitado errado ou é inexistente")
        return 
    }

    try {
        await command.execute(interaction)
    } catch (error){
        console.error(error)
        await interaction.reply("Ocorreu um erro ao executar esse comando.")
    }
});