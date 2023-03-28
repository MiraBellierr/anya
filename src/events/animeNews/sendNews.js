const Discord = require("discord.js");

module.exports = async (client, news) => {
	const channel = await client.channels.fetch(
		process.env.ANIME_NEWS_CHANNEL_ID
	);

	const embed = new Discord.EmbedBuilder()
		.setTitle(news.title)
		.setURL(news.link)
		.setImage(news.image)
		.setDescription(news.description)
		.setColor(Discord.Colors.Navy)
		.setTimestamp(new Date(news.time));

	const m = await channel.send({
		content: `Recent news has just published on <t:${Math.floor(
			new Date(news.time).getTime() / 1000
		)}:f>`,
		embeds: [embed],
	});

	if (m.type === Discord.ChannelType.GuildAnnouncement) m.crosspost();

	if (news.video) {
		const m2 = await channel.send(news.video);
		if (m2.type === Discord.ChannelType.GuildAnnouncement) m2.crosspost();
	}
};
