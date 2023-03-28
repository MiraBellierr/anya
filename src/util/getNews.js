const cheerio = require("cheerio");
const fs = require("fs");
const axios = require("axios");
const baseUrl = "https://www.animenewsnetwork.com";

async function getAnimeNews(client) {
	const { data } = await axios.get(baseUrl);

	try {
		const $ = cheerio.load(data);

		const title = $(
			"div.mainfeed-day:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > h3:nth-child(1) > a:nth-child(1)"
		).text();

		const image = $(
			"div.mainfeed-day:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)"
		).attr()["data-src"];

		const description = $(
			"div.mainfeed-day:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > span:nth-child(2)"
		).text();

		const time = $(
			"div.news:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > time:nth-child(1)"
		).attr().datetime;

		const link = `${baseUrl}${
			$(
				"div.mainfeed-day:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > a:nth-child(2)"
			).attr().href
		}`;

		const { data: data2 } = await axios.get(link);

		const $2 = cheerio.load(data2);
		let video;

		try {
			video = $2(
				".meat > p:nth-child(2) > span:nth-child(1) > span:nth-child(1) > iframe:nth-child(1)"
			).attr().src;
		} catch {
			video = null;
		}

		const animeNews = {
			title,
			image: `${baseUrl}${image}`,
			description,
			time,
			video,
			link,
		};

		if (!title || !description || !image || !link || !time) {
			return console.log("Couldn't retrieve latest Anime news...");
		}

		let previousAnimeNews = fs.readFileSync(
			"./src/database/json/news.json",
			"utf8",
			(err, data) => {
				if (err) console.log(err);

				return data;
			}
		);

		previousAnimeNews = JSON.parse(previousAnimeNews);

		if (!previousAnimeNews.title) previousAnimeNews.title = null;

		if (animeNews.title !== previousAnimeNews.title) {
			console.log("Posting the latest Anime News...");
			fs.writeFile(
				"./src/database/json/news.json",
				JSON.stringify(animeNews),
				(err) => {
					if (err) console.log(err);
				}
			);

			client.emit("animeNews", animeNews);
		}
	} catch (e) {
		console.log(e);
	}
}

module.exports = { getAnimeNews };
