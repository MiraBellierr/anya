const Discord = require("discord.js");

module.exports = async (client, news) => {
	const channel = await client.channels.fetch(
		process.env.ANIME_NEWS_CHANNEL_ID
	);

	const embed = new Discord.EmbedBuilder()
		.setTitle(news.title)
		.setURL(news.link)
		.setImage(news.thumbnail)
		.setDescription(news.description)
		.setColor(Discord.Colors.Navy)
		.setFooter({ text: "animenewsnetwork.com" })
		.setTimestamp(new Date(news.date));

	const m = await channel.send({
		content: `Recent news has just published on <t:${Math.floor(
			new Date(news.date).getTime() / 1000
		)}:f>`,
		embeds: [embed],
	});

	if (channel.type === Discord.ChannelType.GuildAnnouncement) m.crosspost();

	if (news.video !== "") {
		const m2 = await channel.send(news.video);

		if (channel.type === Discord.ChannelType.GuildAnnouncement) m2.crosspost();
	}
};
