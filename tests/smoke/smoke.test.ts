import axios from 'axios';
import { Builder, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

const BASE_URL = 'http://35.209.176.57';
describe('UI Smoke Test', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  test('should load the page and check the title', async () => {
    await driver.get(BASE_URL);
    const title = await driver.getTitle();
    expect(title).toContain('TODO List');
  });
});

async function checkHealth(port: number) {
  const response = await axios.get(`${BASE_URL}:${port}/health`);
  return response.status === 200;
}

test('Smoke Test: Task Manager health check', async () => {
  const TASK_MANAGER_PORT = 3001;
  const isHealthy = await checkHealth(TASK_MANAGER_PORT);
  expect(isHealthy).toBe(true);
});

test('Smoke Test: Random Title Generator health check', async () => {
  const RANDOM_TITLE_GENERATOR_PORT = 3002;
  const isHealthy = await checkHealth(RANDOM_TITLE_GENERATOR_PORT);
  expect(isHealthy).toBe(true);
});
