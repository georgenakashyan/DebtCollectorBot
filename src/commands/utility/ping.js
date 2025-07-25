import { MessageFlags, SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	async execute(interaction) {
		await interaction.reply({
			content: "Pong!",
			flags: MessageFlags.Ephemeral,
		});
	},
};
