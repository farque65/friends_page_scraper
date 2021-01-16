const http = require('http');
const fetch = require('isomorphic-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const async = require('async');
const _ = require('lodash');
const { Pool, Client } = require('pg');

const urlPrefix = 'https://fangj.github.io/friends/';

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "db_friends",
	password: "postgres",
	port: "5432"
});

function addEpisode(number, season, description, link) {
	pool.query(
		`INSERT INTO table_episodes(episode_number, season, description, link)VALUES(${number}, ${season}, ${description}, ${link})`,
		(err, res) => {
		  console.log(err, res);
		  pool.end();
		}
	  );
}

function addScriptLine(character, number, type, scriptLine) {
	pool.query(
		`INSERT INTO table_script_lines(character, line_number, line_type, script_line)VALUES(${character}, ${number}, ${type}, ${scriptLine})`,
		(err, res) => {
		  console.log(err, res);
		  pool.end();
		}
	  );
}

try {
	const response = await fetch(urlPrefix);
	const text = await response.text();
	const dom = await new JSDOM(text);
	const allLiTags = dom.window.document.querySelectorAll('a');
	async.forEachOf(allLiTags, function (element, key, callback) {
		const textContent = element.textContent;
		const episodeNumber = textContent.split(' ')[0];
		const episodeLink = `${urlPrefix}/${element.getAttribute('href')}`;
		let season = episodeNumber.charAt(0);
		if (episodeNumber.charAt(0) === '1' && episodeNumber.length > 3) {
			season = episodeNumber.substring(0, 2);
		}
		async.eachSeries([
			function addEpisodeToDatabase(done){
				addEpisode(episodeNumber, season, details, episodeLink);
				return done();
			},
			function getScriptLines(done) {
				(async ()=> {
					try {
						const response = await fetch(episodeLink);
						const text = await response.text();
						const dom = await new JSDOM(text);
						const h1Tag = dom.window.document.querySelector('h1');
						console.log('h1 Tag ', h1Tag);
						const allPTags = dom.window.document.querySelectorAll('p');
						[].forEach.call(allPTags, function (element) {
							const textContent = element.textContent;
							console.log(episodeNumber, '-->', textContent);
						});
					} catch (error) {
						console.error('response error: ', error);
					}
				})();
				return done();
			}
		], callback);
	});
	return [allUrls];
} catch (error) {
	console.error('response error: ', error);
}
