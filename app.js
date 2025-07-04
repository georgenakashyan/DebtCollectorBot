import {
	InteractionResponseFlags,
	InteractionResponseType,
	InteractionType,
	MessageComponentTypes,
	verifyKeyMiddleware,
} from "discord-interactions";
import "dotenv/config";
import express from "express";
import { connectToDB } from "./db/db.js";
import { getUserCredits, getUserDebts } from "./db/dbQueries.js";

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Initialize database connection
const DB = await connectToDB();

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post(
	"/interactions",
	verifyKeyMiddleware(process.env.PUBLIC_KEY),
	async function (req, res) {
		// Interaction type and data
		const { type, id, data } = req.body;

		/**
		 * Handle verification requests
		 */
		if (type === InteractionType.PING) {
			return res.send({ type: InteractionResponseType.PONG });
		}

		/**
		 * Handle slash command requests
		 * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
		 */
		if (type === InteractionType.APPLICATION_COMMAND) {
			const { name } = data;

			if (name === "totaldebt") {
				const context = req.body.context;
				const userId =
					context === 0 ? req.body.member.user.id : req.body.user.id;
				const guildId = req.body.guild_id;

				const debt = await getUserDebts(userId, guildId);

				return res.send({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						flags: InteractionResponseFlags.IS_COMPONENTS_V2,
						components: [
							{
								type: MessageComponentTypes.TEXT_DISPLAY,
								content: `Total Debt Remaining for <@${userId}>: $${debt}`,
							},
						],
					},
				});
			}

			if (name === "totalowed") {
				const context = req.body.context;
				const userId =
					context === 0 ? req.body.member.user.id : req.body.user.id;
				const guildId = req.body.guild_id;

				const credit = await getUserCredits(userId, guildId);

				return res.send({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						flags: InteractionResponseFlags.IS_COMPONENTS_V2,
						components: [
							{
								type: MessageComponentTypes.TEXT_DISPLAY,
								content: `Total <@${userId}> is owed by others: $${credit}`,
							},
						],
					},
				});
			}

			console.error(`unknown command: ${name}`);
			return res.status(400).json({ error: "unknown command" });
		}

		console.error("unknown interaction type", type);
		return res.status(400).json({ error: "unknown interaction type" });
	}
);

app.listen(PORT, () => {
	console.log("Listening on port", PORT);
});
