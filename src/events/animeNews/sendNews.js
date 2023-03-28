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

	if (channel.type === Discord.ChannelType.GuildAnnouncement) m.crosspost();

	if (news.videos.length > 0) {
		news.videos.forEach(async (video) => {
			const m2 = await channel.send(video);

			if (channel.type === Discord.ChannelType.GuildAnnouncement)
				m2.crosspost();
		});
	}
};
