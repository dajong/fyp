const puppeteer = require("puppeteer");

(async () => {
  // Launch browser and open a new page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Go to the homepage
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });

  // Select a city from the dropdown
  await page.select('select[name="city"]', "Limerick");

  // Input min price
  await page.type('input[name="minPrice"]', "10");

  // Input max price
  await page.type('input[name="maxPrice"]', "1000000");

  // Click the "Filter" button
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2" }),
    page.click('button[type="submit"]')
  ]);

  // Click on the first property's "Details" button
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2" }),
    page.click(".card__footer a")
  ]);

  // Check if the details page loaded successfully
  const detailsHeading = await page.$eval(
    "h1.heading-primary",
    el => el.textContent
  );
  console.log("Details heading:", detailsHeading);

  // Check if the property address is displayed correctly
  const propertyAddress = await page.$eval(
    ".heading-box__group .heading-box__text",
    el => el.textContent
  );
  console.log("Property address:", propertyAddress);

  // Check if the property price is displayed correctly
  const propertyPrice = await page.$eval(
    ".overview-box__group .overview-box__detail:nth-child(2) .overview-box__text",
    el => el.textContent
  );
  console.log("Property price:", propertyPrice);

  // Check if the property style is displayed correctly
  const propertyStyle = await page.$eval(
    ".overview-box__group .overview-box__detail:nth-child(3) .overview-box__text",
    el => el.textContent
  );
  console.log("Property style:", propertyStyle);

  // Check if the property description exists
  const propertyDescriptionExists =
    (await page.$(".description-box p.description__text")) !== null;
  console.log("Property description exists:", propertyDescriptionExists);

  // Check if the Google Maps iframe exists
  const googleMapsIframeExists =
    (await page.$(".w-75.mx-auto.text-center iframe")) !== null;
  console.log("Google Maps iframe exists:", googleMapsIframeExists);

  // Close the browser
  await browser.close();
})();
