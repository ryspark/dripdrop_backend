import { Builder, By, until, WebDriver, WebElement } from 'selenium-webdriver';
import chrome, { Options, ServiceBuilder } from 'selenium-webdriver/chrome';

// Define the function to extract floating-point numbers from a string
function extractFloat(inputString: string): number | null {
    const match = inputString.match(/^(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : null;
}

export async function startCrawler(query: string, is_food: boolean): Promise<any> {
    let options = new Options();
    if (process.env.GOOGLE_CHROME_BIN) {
        options.setChromeBinaryPath(process.env.GOOGLE_CHROME_BIN);
    }

    options.addArguments('--headless', '--disable-gpu', '--window-size=1920,1080', '--no-sandbox', '--disable-dev-shm-usage');


    if (!is_food) {
        return null;
    }

    let driver = null;
    if (process.env.CHROMEDRIVER_PATH) {
  	driver = new Builder()
		.forBrowser('chrome')
		.setChromeService(new ServiceBuilder(process.env.CHROMEDRIVER_PATH))
		.setChromeOptions(options)
		.build();
	} else {
	    driver = await new Builder()
		.forBrowser('chrome')
		.setChromeOptions(options)
		.build();
	}

    try {
        const encodedQuery = encodeURIComponent(query);
        const url = `https://apps.carboncloud.com/climatehub/search?q=${encodedQuery}&market=USA`;
        await driver.get(url);

        const cookieButton = await driver.wait(until.elementLocated(By.id("CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll")), 10000);
        await cookieButton.click();

        await driver.sleep(2000);

        const tbody = await driver.wait(until.elementLocated(By.css('tbody')), 10000);
        const rows = await tbody.findElements(By.tagName('tr'));

        for (const row of rows) {
            const cells = await row.findElements(By.tagName('td'));
	    const emissions = extractFloat(await cells[5].getText());
	    return emissions;
        }

    } catch (error) {
        console.error('Error during crawling:', error);
        return null;
    } finally {
        await driver.quit();
    }
}

//export async function runCrawlers(queries: string[]): Promise<{ [query: string]: number | null }> {
//    const promises = queries.map(query => startCrawler(query));
//    const results = await Promise.all(promises);
//
//    const result: { [query: string]: number | null } = {};
//    queries.forEach((query, index) => {
//        result[query] = results[index];
//    });
//
//    return result;
//}
//
//export async function runCrawlers(data: { id: number, name: string }[]): Promise<void> {
//    await Promise.all(data.map(async (item) => {
//        item.score = await startCrawler(item.name);
//    }));
//}

interface Item {
  id: string;
  name: string;
  is_food: boolean;
  score?: number;
}

export async function runCrawlers(data: Item[]): Promise<void> {
  await Promise.all(data.map(async (item) => {
    item.score = await startCrawler(item.name, item.is_food);
  }));
}

//const queries = ["Soybean", "Corn", "Wheat", "fritos", "burger", "chips", "food", "burger", "odin", "aweifoawiejfoije"];
//
//runCrawlers(queries).then(resultMap => {
//    console.log("Emissions Data:", resultMap);
//}).catch(error => {
//    console.error("Error running crawlers:", error);
//});
//
//
//const queries = [
//    { id: "1", name: "Soybean", is_food: true},
//    { id: "2", name: "Corn", is_food: true},
//    { id: "3", name: "Wheat", is_food: true},
//    { id: "4", name: "fritos", is_food: true},
//    { id: "5", name: "burger", is_food: true},
//    { id: "6", name: "chips", is_food: true},
//    { id: "7", name: "food", is_food: true},
//    { id: "8", name: "burger", is_food: false},
//    { id: "9", name: "odin", is_food: false},
//    { id: "10", name: "aweifoawiejfoije", is_food: false}
//];
//
//runCrawlers(queries).then(() => {
//    console.log("Data with scores:", queries);
//}).catch(error => {
//    console.error("Error running crawlers:", error);
//});
//
