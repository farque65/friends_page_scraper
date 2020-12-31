const http = require('http');
const fetch = require('isomorphic-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const async = require('async');
const _ = require('lodash');


const urlPrefix = 'https://fangj.github.io/friends/';

async.waterfall([
	async function getAllUrls(done) {
		let allUrls = [];
		try {
			const response = await fetch(urlPrefix);
			const text = await response.text();
			const dom = await new JSDOM(text);
			const allLiTags = dom.window.document.querySelectorAll('a');
			[].forEach.call(allLiTags, function (element) {
				const textContent = element.textContent;
				const episodeNumber = textContent.split(' ')[0];
				const episodeLink = `${urlPrefix}/${element.getAttribute('href')}`;
				let season = episodeNumber.charAt(0);
				if (episodeNumber.charAt(0) === '1' && episodeNumber.length > 3) {
					season = episodeNumber.substring(0, 2);
				}
				const episodeObj = {
					details: textContent,
					season,
					episode: episodeNumber,
					link: episodeLink,
				};
				if (!_.isEmpty(episodeObj)) {
					allUrls.push(episodeObj);
				}
			});
			return [allUrls];
		} catch (error) {
			console.error('response error: ', error);
		}
	},
	function getAllScripts(urlArray, done) {
		// Check each episode
		async.forEachOf(urlArray[0], (value, key, callback)=> {
			(async ()=> {
				console.log(value, key);
				try {
					const response = await fetch(value.link);
					const text = await response.text();
					const dom = await new JSDOM(text);
					const h1Tag = dom.window.document.querySelector('h1');
					console.log('h1 Tag ', h1Tag);
					const allPTags = dom.window.document.querySelectorAll('p');
					[].forEach.call(allPTags, function (element) {
						const textContent = element.textContent;
						console.log('check P ', textContent, element);
						const episodeNumber = textContent.split(' ')[0];
						const episodeLink = `${urlPrefix}/${element.getAttribute('href')}`;
						let season = episodeNumber.charAt(0);
						if (episodeNumber.charAt(0) === '1' && episodeNumber.length > 3) {
							season = episodeNumber.substring(0, 2);
						}
						const episodeObj = {
							details: textContent,
							season,
							episode: episodeNumber,
							link: episodeLink,
						};
						if (!_.isEmpty(episodeObj)) {
							allUrls.push(episodeObj);
						}
					});
					return [allUrls];
				} catch (error) {
					console.error('response error: ', error);
				}
			})();
			callback();
		}, done);
	}
], () => {});