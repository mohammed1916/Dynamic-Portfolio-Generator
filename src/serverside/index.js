const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const isHeadlessMode = false;
const PORT = 8080;
const app = express();
// app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors());
const corsOptions = {
	origin: "http://localhost:3000"
};

let code = "AQTLTKeLtaja_Xq3B9UjRkZdE862AOKyWOF7ijzKfwxWi5HyQreF82WC4VoS0Qy-JPGJz09BVm-qMXcXN-WmxDxOMnQ0qM_NN9gOXMdk8k5tsjTIN7H828ADW8gz8PMcdSLXeeLy45Ke8xJxcVVlON-ejUpXNBrtWNbAz4mrbmyy2rlGUlSkdN_r5DimUyAaPk21sOd7g6f_nzGsEn8";

app.get('/auth/:code', async (req, res) => {
	code = req.params.code;
	console.log("🔥 code :", code);
	const client_id = "863yjvgqsfyyvq";
	const client_secret = "dVfyZFbQ3zPMs4B5";
	const callback_url = "http://localhost:3000/form/callback";
	const url = `https://www.linkedin.com/oauth/v2/accessToken?code=${code}&grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${callback_url}`;
	const requestEndpoint = url;
	console.log("🚀 url :", url);
	// app.get('/', cors(corsOptions), async (req, res) => {
	// 	console.log("💪 err ")
	try {
		const fetchOptions = {
			method: 'POST',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}
		const response = await fetch(requestEndpoint, fetchOptions);
		const jsonResponse = await response.json();
		if (jsonResponse["access_token"] !== undefined) {
			res.send(jsonResponse["access_token"]);
		}
		else
			res.send("ERROR");
		console.log("💪 jsonResponse[\"access_token\"]", jsonResponse["access_token"]);
		ret = jsonResponse["access_token"]
	} catch (err) {
		console.log("🛠️ err ", err)
	}
	// });
	// return Promise.resolve("Sample");
	// res.send("Sample");
});


app.listen(PORT, () => {
	console.log(`✅ Server app listening at http://localhost:${PORT}`);
});

/**
 * Puppeteer
 */
const puppeteer = require('puppeteer');
const fs = require('node:fs')
// const linkedinURL = 'https://www.linkedin.com/in/curious-mohammed-abdullah/';
// const certURL = linkedinURL + "details/certifications/";
// const projectsURL = linkedinURL + "details/projects/";
// const skillsURL = linkedinURL + "details/skills/";


class SkillClass {
	constructor(skills) {
		this.skillsGlobal = skills;
	}
}
class CertClass {
	constructor(certificates) {
		this.certificatesGlobal = certificates;
	}
}
class LinkDataClass {
	constructor(url, folder) {
		this.folder = folder;
		this.linkedinURL = url;
		this.certURL = this.linkedinURL + "details/certifications/";
		this.projectsURL = this.linkedinURL + "details/projects/";
		this.skillsURL = this.linkedinURL + "details/skills/";
		this.start = this.start.bind(this);
		this.signIn = this.signIn.bind(this);
		// this.linkedinData = this.linkedinData.bind(this);
	}
	async start() {
		await Promise.all([
			// await this.login(),
			await this.skillsData(),
			await this.certData(),
			await this.projData(),
			await this.linkedinData(),
		])
		console.log("close")
	}
	async signIn() {
		await Promise.all([
			await this.login(),
			// await this.linkedinData(),
		])
		console.log("close")
	}
	async login() {
		console.log("login")
		const browser = await launchBrowser(false);
		const page = await browser.newPage();
		console.log("linkedinURL", this.linkedinURL)
		await Promise.all([
			await page.goto("https://www.linkedin.com/login", { waitUntil: 'load', timeout: 0 }),
			// await page.setDefaultNavigationTimeout(60000);
			await page.waitForSelector(".authwall-join-form__title", { waitUntil: 'load', timeout: 0 }),
			// await page.waitForSelector("body div"),
			// await page.waitForNetworkIdle()
		]
		);

		await browser.close()

	}
	async linkedinData() {
		const browser = await launchBrowser(isHeadlessMode);
		const page = await browser.newPage();
		console.log("linkedinURL", this.linkedinURL)
		await Promise.all([
			await page.goto(this.linkedinURL),
			await page.waitForSelector(".text-heading-xlarge.inline.t-24.v-align-middle.break-words"),
			await page.waitForSelector(".display-flex.flex-wrap.align-items-center.full-height"),
			// await page.waitForSelector("body div"),
			await page.waitForNetworkIdle(),
		]
		);
		const work = await page.evaluate(() => {
			return JSON.stringify({
				"work": [{
					"company": document.querySelector(`#${document.getElementById('experience').parentNode.id}  div ul li div div div div .t-14.t-normal .visually-hidden`).innerText,
					"title": document.querySelector(`#${document.getElementById('experience').parentNode.id} div ul li div div div div div span .visually-hidden`).textContent,
					"dates": document.querySelector(`#${document.getElementById('experience').parentNode.id}  .t-14.t-normal.t-black--light .visually-hidden`).innerText,
					"location": document.querySelectorAll(`#${document.getElementById('experience').parentNode.id}  .t-14.t-normal.t-black--light .visually-hidden`)[1].textContent,
					"thumbnail": document.querySelectorAll(`#${document.getElementById('experience').parentNode.id}  .ivm-view-attr__img-wrapper.ivm-view-attr__img-wrapper--use-img-tag.display-flex > img`)[0].src,
					description: document.querySelectorAll(`#${document.getElementById('experience').parentNode.id}  .inline-show-more-text.inline-show-more-text--is-collapsed.inline-show-more-text--is-collapsed-with-line-clamp.full-width .visually-hidden`)[0].textContent

				},
				],
			})
		})
		const education = await page.evaluate(() => {
			return JSON.stringify({
				"education": [{
					"Institution":
						document.querySelector(`#${document.getElementById("education").parentElement.id} .pvs-list__outer-container .pvs-list .artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column .pvs-entity.pvs-entity--padded.pvs-list__item--no-padding-in-columns .display-flex.flex-column.full-width.align-self-center .display-flex.flex-row.justify-space-between .optional-action-target-wrapper.display-flex.flex-column.full-width .display-flex.flex-wrap.align-items-center.full-height .mr1.hoverable-link-text.t-bold .visually-hidden`).innerText,
					"Program":
						document.querySelector(`#${document.getElementById("education").parentElement.id} .pvs-list__outer-container .pvs-list .artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column .pvs-entity.pvs-entity--padded.pvs-list__item--no-padding-in-columns .display-flex.flex-column.full-width.align-self-center .display-flex.flex-row.justify-space-between .optional-action-target-wrapper.display-flex.flex-column.full-width .t-14.t-normal .visually-hidden`).innerText,
					"YearOfPassing":
						document.querySelector(`#${document.getElementById("education").parentElement.id} .pvs-list__outer-container .pvs-list .artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column .pvs-entity.pvs-entity--padded.pvs-list__item--no-padding-in-columns .display-flex.flex-column.full-width.align-self-center .display-flex.flex-row.justify-space-between .optional-action-target-wrapper.display-flex.flex-column.full-width .t-14.t-normal.t-black--light .visually-hidden`).innerText,
					"Grade":
						document.querySelector(`#${document.getElementById("education").parentElement.id} div ul li div div div div div div .visually-hidden`).innerText,
					"website":
						"",
				},
				],
			})
		})
		const data = await page.evaluate(() => {
			const DATA = {
				"information": {
					"name": document.querySelectorAll(".text-heading-xlarge.inline.t-24.v-align-middle.break-words")[0].innerText,
					"domain": document.querySelectorAll(".text-body-medium.break-words")[0].innerText,
					"image": document.querySelectorAll(".ember-view.profile-photo-edit__preview")[0].getAttribute('src'),
					// email: email,
					"description": document.querySelectorAll(".inline-show-more-text.inline-show-more-text--is-collapsed.inline-show-more-text--is-collapsed-with-line-clamp.full-width")[0].innerText,
					"profiles": [
						{
							"media": "Linkedin",
							"url": "",
							"icon": "./img/icons/media/linkedin.png"
						},
					],
				}
			}
			return DATA;
		}).then((DATA) => {
			DATA.information.profiles[0].url = this.linkedinURL;
			return JSON.stringify(DATA)
		});
		Promise.all([
			work,
			education,
		])
		var DATA = Promise.resolve(data)
		DATA.then(() => {
			console.log("data1: ", data);
			console.log("data1 Path: ", `data/${this.linkedinURL}/data.json`);
			fs.writeFile(`data/${this.folder}/data.json`, data, () => console.log("data write... data"))
			fs.writeFile(`data/${this.folder}/education.json`, education, () => console.log("data write... education"))
			fs.writeFile(`data/${this.folder}/work.json`, work, () => console.log("data write... work"))
		})
		await browser.close()

	}
	async skillsData() {
		const browserSkill = await launchBrowser(isHeadlessMode);
		const pageSkill = await browserSkill.newPage();

		console.log("this.skillsURL", this.skillsURL)
		await Promise.all([
			await pageSkill.goto(this.skillsURL),
			await pageSkill.waitForSelector(".t-20.t-bold.ph3.pt3.pb2", { timeout: 0 }),
			await pageSkill.waitForNetworkIdle(),
		])
		const skills = await pageSkill.evaluate(() => {
			const data = new Set(Array.from(document.querySelectorAll("li > div > div > div > div > a > div > span > .visually-hidden")).map((skillsData) => skillsData.textContent))
			return [...data].join(", ");
		});
		this.skillsObj = new SkillClass(skills);
		console.log("skills: ", skills)
		fs.writeFile(`data/${this.folder}/skills.json`, `{
			"skills": [
				{
					"type": "",
					"KnowledgeInAdvanceTopics": "",
					"KnowledgeInMainConcepts": ${JSON.stringify(skills)},
            "Beginner": ""
        }
    ]
}`, () => console.log("skills write.. "))
		await browserSkill.close();
	}
	async certData() {
		const browserCert = await launchBrowser(isHeadlessMode);
		const pageCert = await browserCert.newPage();
		console.log("certURL", this.certURL)
		await Promise.all([
			await pageCert.goto(this.certURL),
			await pageCert.waitForSelector(".t-20.t-bold.ph3.pt3.pb2"),
			await pageCert.waitForNetworkIdle()
		])
		const certificates = await pageCert.evaluate(() => {
			var titles = Array.from(document.querySelectorAll("div > div div > ul > li > div > div > div > div > a > div > span > .visually-hidden")).map((e) => e.textContent);
			const cred = Array.from(document.querySelectorAll("section div div div ul li .pv2 a")).map((e) => e.href)
			var subData = Array.from(document.querySelectorAll("div > div div > ul > li > div > div > div > div > a > span > .visually-hidden")).map((e) => e.textContent)
			let woCredname = Array.from(document.querySelectorAll("div > div div > ul > li > div > div > div > div > div > div > span > .visually-hidden")).map((e) => e.textContent);
			let woCred = Array.from(document.querySelectorAll("div > div div > ul > li > div > div > div > div > div > span > .visually-hidden")).map((e) => e.textContent);
			titles = titles.concat(woCredname)
			subData = subData.concat(woCred)
			return JSON.stringify(Array.from(titles).map((e, i) => {
				return {
					"title": e,
					"date": subData[3 * i + 1],
					"institution": subData[3 * i],
					"thumbnail": cred[i],
					"description": ""
				}
			}));
		});
		this.certObj = new CertClass(certificates);
		console.log("certificates: ", certificates)
		fs.writeFile(`data/${this.folder}/certificates.json`, `{\"certificates"\: ${certificates}}`, () => console.log("certificate write.. "))
		await browserCert.close()
	}
	async projData() {
		const browserProj = await launchBrowser(isHeadlessMode);
		const pageProj = await browserProj.newPage();
		console.log("this.projectsURL", this.projectsURL)
		await Promise.all([
			await pageProj.goto(this.projectsURL),
			await pageProj.waitForSelector(".t-20.t-bold.ph3.pt3.pb2"),
			await pageProj.waitForNetworkIdle()
		])
		const projects = await pageProj.evaluate(() => {
			var titles = Array.from(document.querySelectorAll(`main section div div div ul li div div div div div div span .visually-hidden`)).map((e) => e.innerText);
			var dates = Array.from(document.querySelectorAll(`main section div div div ul li div div div div .display-flex.flex-column.full-width .t-14.t-normal .visually-hidden`)).map((e) => e.innerText);
			let gitlink = Array.from(document.querySelectorAll(`ul li div div div div ul li a`)).map((e) => e.href);
			let description = Array.from(document.querySelectorAll(`li div div div div ul li div ul li div div div .visually-hidden`)).map((e) => e.innerText);
			return JSON.stringify(Array.from(titles).map((e, i) => {
				return {
					"title": e,
					"dates": dates[i],
					"type": "",
					"thumbnail": "",
					"link": "",
					"gitlink": gitlink[i],
					"description": description[i]
				}
			}));
		});
		this.certObj = new CertClass(projects);
		console.log("projects: ", projects)
		fs.writeFile(`data/${this.folder}/projects.json`, `{\"projects"\: ${projects}}`, () => console.log("projects write.. "))
		await browserProj.close()
	}
}

async function launchBrowser(isHeadless) {
	return puppeteer.launch(
		{
			// executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
			executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
			// userDataDir: "/Users/mohammedabdullah/Library/Application Support/Google/Chrome/Profile 4",
			userDataDir: "C:\\Users\\arrah\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 6",
			headless: isHeadless,
			timeout: 0,
			defaultViewport: { height: 600, width: 600 }
		}
	);
}
app.get("/skills/:path", (req, res) => {
	fs.readFile(`data/${req.params.path}/skills.json`, 'utf-8', (err, data) => {
		console.log("read... Skills", data);
		res.send(data);
		console.log("sent skills", data)
	});
})
app.get("/certificates/:path", (req, res) => {
	fs.readFile(`data/${req.params.path}/certificates.json`, 'utf-8', (err, data) => {
		console.log("read... Certificates");
		res.send(data);
		console.log("sent certificates", data)
	});
})
app.get("/data/:path", (req, res) => {
	fs.readFile(`data/${req.params.path}/data.json`, 'utf-8', (err, data) => {
		res.send(data);
	});
})
app.get("/work/:path", (req, res) => {
	fs.readFile(`data/${req.params.path}/work.json`, 'utf-8', (err, data) => {
		res.send(data);
	});
})
app.get("/education/:path", (req, res) => {
	fs.readFile(`data/${req.params.path}/education.json`, 'utf-8', (err, data) => {
		res.send(data);
	});
})
app.get("/projects/:path", (req, res) => {
	fs.readFile(`data/${req.params.path}/projects.json`, 'utf-8', (err, data) => {
		res.send(data);
	});
})
app.get("/getLinkedInData/:url", (req, res) => {
	let data = "https://www.linkedin.com/in/" + req.params.url + "/"
	console.log("getLinkedInData ", data)
	const dir = `data/${req.params.url}`;
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir)
	}
	const l = new LinkDataClass(data, req.params.url);
	l.start();

});
app.get("/signInLinkedIn/:url", (req, res) => {
	let data = "https://www.linkedin.com/in/" + req.params.url + "/"
	console.log("getLinkedInData ", data)
	const dir = `data/${req.params.url}`;
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir)
	}
	const l = new LinkDataClass(data, req.params.url);
	l.signIn();

});


/**
 * Run with cron
*/
//pm2 start index.js --cron "*/15 * * * *"
//pm2 delete all
/**
 *
 */

// (async () => {
// 		const users = await fs.promises.opendir('\data');
// 		for await (const user of users) {
// 			if (user.isDirectory()) {
// 				console.log("user: ", user.name);
// 	/**  console.log(new Date()); */
// 				let data = "https://www.linkedin.com/in/" + user.name + "/"
// 				const l = new LinkDataClass(data, user.name);
// 				l.start();
// 			}
// 		}
// })();
