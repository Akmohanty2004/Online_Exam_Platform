const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  try {
    console.log("Navigating to login...");
    await page.goto('http://localhost:5173/login');
    
    // Fill login
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'ashiskumarmohanty738@gmail.com');
    await page.type('input[type="password"]', 'Student123!');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log("Logged in. Navigating to student exams...");
    
    await page.goto('http://localhost:5173/student/exams');
    await page.waitForSelector('.card');
    
    // Click Start Exam for the specific exam
    console.log("Finding exam 6a440c32afe214e01b0f63e7...");
    // Just directly navigate to the exam page since the user did that
    console.log("Navigating directly to exam page...");
    await page.goto('http://localhost:5173/student/exam/6a440c32afe214e01b0f63e7', { waitUntil: 'networkidle0' });
    
    // Wait a bit for rendering
    await page.waitForTimeout(2000);
    
    const screenshotPath = path.join(__dirname, 'exam_screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log("Screenshot saved at:", screenshotPath);
    
    // Also log any console errors from the page
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    // Let's get the innerHTML of the body to see what's rendered
    const html = await page.evaluate(() => document.body.innerHTML);
    console.log("Body length:", html.length);
    if(html.includes("vet")) {
      console.log("Question 'vet' found in HTML!");
    } else {
      console.log("Question NOT found in HTML.");
      console.log(html.substring(0, 500)); // print beginning of html
    }
    
  } catch(e) {
    console.error("Error during puppeteer:", e);
  } finally {
    await browser.close();
  }
})();
