const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const http2 = require("http").Server(app);
const puppeteer = require("puppeteer");
const PuppeteerMassScreenshots = require("./screen.shooter");
const PORT = 4000;
const PORT2 = 4001;
const isHeadlessMode = true;
const socketIO = require("socket.io")(http, {
	cors: {
		origin: "http://localhost:3000",
	},
});
const socketIO2 = require("socket.io")(http2, {
	cors: {
		origin: "http://localhost:3000",
	},
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let channelList = [];
socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on('browse', async ({ url }) => {
		if (url !== '') {
			console.log("url:::", url);
			if (url == undefined) return;
			const browser = await launchBrowser(isHeadlessMode);
			const context = await browser.createIncognitoBrowserContext();
			const page = await context.newPage();
			await page.setViewport({
				width: 1255,
				height: 800,
			});
			console.log("url: :", url)
			await page.goto(url);
			const screenshots = new PuppeteerMassScreenshots();
			await screenshots.init(page, socket);
			await screenshots.start();
			socket.on('mouseMove', async ({ x, y }) => {
				try {
					await page.mouse.move(x, y);
					const cur = await page.evaluate((p) => {
						const elementFromPoint = document.elementFromPoint(p.x, p.y);
						return window
							.getComputedStyle(elementFromPoint, null)
							.getPropertyValue('cursor');
					}, { x, y });

					socket.emit('cursor', cur);
				} catch (err) { }
			});

			socket.on('mouseClick', async ({ x, y }) => {
				try {
					await page.mouse.click(x, y);
				} catch (err) { }
			});

			socket.on('scroll', ({ position }) => {
				page.evaluate((top) => {
					window.scrollTo({ top });
				}, position);
			});
		}
	});

	socket.on("disconnect", () => {
		socket.disconnect();
		console.log("🔥: A user disconnected");
	});

});

socketIO2.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} 2user just connected!`);

	socket.on('browse', async ({ url }) => {
		if (url !== '') {
			console.log("url2:::", url);
			if (url == undefined) return;
			const browser = await launchBrowser(isHeadlessMode);
			const context = await browser.createIncognitoBrowserContext();
			const page = await context.newPage();
			await page.setViewport({
				width: 1255,
				height: 800,
			});
			await page.goto(url);
			const screenshots = new PuppeteerMassScreenshots();
			await screenshots.init(page, socket);
			await screenshots.start();
			socket.on('mouseMove', async ({ x, y }) => {
				try {
					await page.mouse.move(x, y);
					const cur = await page.evaluate((p) => {
						const elementFromPoint = document.elementFromPoint(p.x, p.y);
						return window
							.getComputedStyle(elementFromPoint, null)
							.getPropertyValue('cursor');
					}, { x, y });

					socket.emit('cursor', cur);
				} catch (err) { }
			});

			socket.on('mouseClick', async ({ x, y }) => {
				try {
					await page.mouse.click(x, y);
				} catch (err) { }
			});

			socket.on('scroll', ({ position }) => {
				page.evaluate((top) => {
					window.scrollTo({ top });
				}, position);
			});
		}
	});

	socket.on("disconnect", () => {
		socket.disconnect();
		console.log("🔥: 2 user disconnected");
	});
});

http.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
http2.listen(PORT2, () => {
	console.log(`Server2 listening on ${PORT2}`);
});

async function launchBrowser(isHeadless) {
	return puppeteer.launch(
		{
			// executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
			executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
			// userDataDir: "/Users/mohammedabdullah/Library/Application Support/Google/Chrome/Profile 4",
			userDataDir: "C:\\Users\\arrah\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 6",
			headless: isHeadless,
		}
	);
}