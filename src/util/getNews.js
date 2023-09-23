const cheerio = require("cheerio");
const axios = require("axios");
const baseUrl = "https://www.animenewsnetwork.com";

async function getAnimeNews(client, db) {
	const { data } = await axios.get(baseUrl);

	try {
		const $ = cheerio.load(data);

		const firstNews = $(".mainfeed-day")
			.first()
			.children(".mainfeed-section")
			.children(".news")
			.first()
			.html();

		const $$ = cheerio.load(firstNews);

		const thumbnail = baseUrl + $$(".thumbnail").attr()["data-src"];
		const title = $$(".wrap > div > h3 > a").text();
		const date = $$(".wrap > div > .byline > time").attr().datetime;
		const description =
			$$(".wrap > div > .preview > .intro").text() +
			" " +
			$$(".wrap > div > .preview > .full").text();
		const link = baseUrl + $$(".wrap > div > h3 > a").attr().href;

		const data2 = await axios.get(link);

		const newsRawData = data2.data;

		const $$$ = cheerio.load(newsRawData);

		let video = $$$("iframe").length;

		if (video === 1) {
			video = $$$("iframe").attr().src;
		} else if (video > 1) {
			video = $$$("iframe").first().attr().src;
		} else {
			video = "";
		}

		const id = $(".mainfeed-day")
			.first()
			.children(".mainfeed-section")
			.children(".news")
			.first()
			.attr()["data-topics"];

		const newsData = {
			id,
			thumbnail,
			title,
			date,
			description,
			link,
			video,
		};

		try {
			const oldId = await db.getData("/news/id");

			if (newsData.id !== oldId) {
				await db.push("/news", newsData);
				client.emit("animeNews", newsData);
			}
		} catch {
			await db.push("/news", newsData);
			client.emit("animeNews", newsData);
		}
	} catch (e) {
		console.log(e);
	}
}

module.exports = { getAnimeNews };
