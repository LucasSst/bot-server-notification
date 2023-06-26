const {REST, Routes} = require("discord.js")
const dotenv = require('dotenv');

dotenv.config();
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env

const fs = require('node:fs');
const path = require('node:path');
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [
];

for (const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command){
        commands.push(command.data.toJSON());
    }else {
        console.log(`Esse comando em ${filePath} falhou no requimento da propriedade "data" ou no "execute"`)
    }
}



const rest = new REST({version: "10"}).setToken(TOKEN);

(async () => {
	try {
		console.log(`Iniciou a atualização dos ${commands.length} comandos`);

		
		const data = await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: commands },
		);

		console.log(`Sucesso na atualização dos comandos ${data.length}! Digite (/) para os comandos!.`);
	} catch (error) {
		console.error(error);
	}
})();