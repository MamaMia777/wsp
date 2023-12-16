import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import {
  LOGIN_BUTTON_SELECTOR_ID,
  LOGIN_CODE_INPUT,
  LOGIN_CODE_SPAN,
  LOGIN_CONTINUE_BUTTON,
  LOGIN_FINAL_BUTTON,
  LOGIN_PASSWORD_INPUT_SELECTOR_ID,
  LOGIN_USERNAME_INPUT_SELECTOR_ID,
} from 'src/common/constants';
const SELLERS_PER_PAGE = 50;
import { ConfigService } from 'src/config/config.service';
import {
  IPrice,
  IOption,
  ICategory,
  IParseCategoryResult,
} from 'src/common/interfaces';
@Injectable()
export class ParserService {
  constructor(private readonly configService: ConfigService) {}

  private async loginToPage(page: any) {
    const url = 'https://www.eis.gov.lv';

    try {
      const cookiesString = fs.readFileSync('./cookies.json', 'utf-8');
      const credentialsConfig = await this.configService.getConfig();
      await page.setCookie(...JSON.parse(cookiesString));
      await page.goto(url);
      const lb = await page.$(LOGIN_BUTTON_SELECTOR_ID);
      if (!lb) {
        Logger.log('Already logged in');
        return cookiesString;
      } else {
        Logger.log('Logging in');
      }
      await page.click(LOGIN_BUTTON_SELECTOR_ID);
      await page.type(
        LOGIN_USERNAME_INPUT_SELECTOR_ID,
        credentialsConfig.login,
      );
      await page.type(
        LOGIN_PASSWORD_INPUT_SELECTOR_ID,
        credentialsConfig.password,
      );
      await page.click(LOGIN_CONTINUE_BUTTON);
      await page.waitForSelector(LOGIN_CODE_SPAN);

      const code: number = await page.evaluate((selector) => {
        const el = document.querySelector(selector);
        const text = el?.parentElement?.innerText;
        return text?.split('Nr.')[1].trim().replace(':', '')
          ? parseInt(text?.split('Nr.')[1].trim().replace(':', ''))
          : 1;
      }, LOGIN_CODE_SPAN);

      await page.type(LOGIN_CODE_INPUT, credentialsConfig.keys[code]);
      await page.click(LOGIN_FINAL_BUTTON);
      const sleep = (milliseconds: number) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
      };
      await sleep(4500);

      const parsedCookies = await page.cookies();

      fs.writeFileSync(
        './cookies.json',
        JSON.stringify(parsedCookies, null, 2),
      );
    } catch (e: Error | any) {
      throw new Error(e.message);
    }
  }
  public async parseCategory(categoryId: string): Promise<ICategory> {
    const browser = await puppeteer.launch({
      headless: 'new',
    });
    try {
      const eisData: Array<IParseCategoryResult> = [];
      let productId = '';
      let productName = '';
      const page = await browser.newPage();
      await this.loginToPage(page);
      const URL = `https://www.eis.gov.lv/EIS/Categories/SearchFaProducts.aspx?FaNumber=${categoryId}`;
      await page.goto(URL);
      Logger.log(`[INFO] Started parsing category ${categoryId}`);

      const numberOfSellers: number = await page.evaluate(() => {
        const regex = /no\s(.*?)\sierakstiem/;
        const text = document
          .querySelector(
            '#ctl00_uxMainContent_uxFilteredProductListControl_uxUpdatePanel > div.paging-wrapper > div.paging-left',
          )
          .textContent.trim();
        return Number(text.match(regex)[1]);
      });

      const numberOfPageIterations = Math.ceil(
        numberOfSellers / SELLERS_PER_PAGE,
      );

      for (let i = 0; i < numberOfPageIterations; i++) {
        for (let k = 2; k <= numberOfSellers - i * SELLERS_PER_PAGE + 1; k++) {
          await this.performPostBack(page, k);
          await page.waitForNavigation();
          const companyName = await page.evaluate(() => {
            return document
              .querySelector(
                '#ctl00_uxMainContent_uxFilteredProductListControl_uxProductEditControl_uxManufacturer',
              )
              ?.textContent.trim();
          });
          if (productId.length === 0) {
            productId = await page.evaluate(() => {
              return document
                .querySelector(
                  '#ctl00_uxMainContent_uxFilteredProductListControl_uxProductEditControl_uxSupplierProductCode',
                )
                .textContent.trim();
            });
          }
          if (productName.length === 0) {
            productName = await page.evaluate(() => {
              return document
                .querySelector(
                  '#ctl00_uxMainContent_uxFilteredProductListControl_uxProductEditControl_uxName',
                )
                .textContent.trim();
            });
          }
          const discounts = await page.evaluate(() => {
            const discounts = new Map<number, number>();
            const rows = document.querySelectorAll(
              '#ctl00_uxMainContent_uxFilteredProductListControl_uxProductEditControl_uxDiscounts > tbody > tr:not(.contenttablehead)',
            );
            Array.from(rows).forEach((row) => {
              const tds = row.querySelectorAll('td');
              const amount = Number(tds[0].textContent.trim());
              const discount = Number(
                tds[1].querySelector('span').textContent.trim(),
              );
              if (amount > 0 && discount > 0) discounts.set(amount, discount);
            });
            return discounts;
          });
          const priceList: Array<IPrice> = await page.evaluate(
            (CATEGORY_POPUP_PRICETABLE) => {
              const rows = document.querySelectorAll(
                `${CATEGORY_POPUP_PRICETABLE} > tbody > tr:not(.contenttablehead)`,
              );
              return Array.from(rows).map((row) => {
                const tds = row.querySelectorAll('td');
                const city = tds[0].textContent.trim();
                const price = Number(
                  tds[1].querySelector('span').textContent.trim(),
                );
                return {
                  city: city.charAt(0) === 'R' ? 'RIGA' : city,
                  price,
                };
              });
            },
            '#ctl00_uxMainContent_uxFilteredProductListControl_uxProductEditControl_uxPriceList',
          );
          const options: Array<IOption> = await page.evaluate(
            (EQUIPMENT_TABLE_SELECTOR) => {
              const rows = document.querySelectorAll(
                `${EQUIPMENT_TABLE_SELECTOR} > tbody > tr:not(.contenttablehead)`,
              );
              const options: Array<IOption> = [];
              Array.from(rows).forEach((row) => {
                if (
                  row.id.includes('uxPropertyRow') &&
                  !row.classList.contains('equipmentRow')
                ) {
                  options.push({
                    name: row.querySelector('td').textContent.trim(),
                    subOptions: [],
                  });
                } else if (
                  row.classList.contains('equipmentRow') &&
                  row.id.includes('uxPropertyRow')
                ) {
                  const tds = row.querySelectorAll('td');
                  options.push({
                    name: tds[0].textContent.trim(),
                    price: Number(
                      tds[1].querySelector('span').textContent.trim(),
                    ),
                  });
                } else if (row.classList.contains('equipmentRow')) {
                  const tds = row.querySelectorAll('td');
                  const option = options[options.length - 1];
                  option.subOptions.push({
                    name: tds[0].textContent.trim(),
                    price: Number(
                      tds[1].querySelector('span').textContent.trim(),
                    ),
                  });
                }
              });
              return options;
            },
            '#uxEquipmentPriceTable',
          );
          eisData.push({
            companyName,
            discounts,
            priceList,
            options,
          });
        }
      }
      Logger.log(`[INFO] Parsed category ${categoryId}]`);
      return {
        categoryId,
        productId,
        name: productName,
        eisData,
      };
    } catch (e) {
      Logger.error('Error parsing category', e.message);
    } finally {
      browser.close();
    }
  }

  private async performPostBack(page: any, index: number) {
    const indexString = index < 10 ? `0${index}` : `${index}`;
    await page.evaluate((indexString) => {
      // @ts-ignore
      document.querySelector('[name="__EVENTTARGET"]').value =
        `ctl00$uxMainContent$uxFilteredProductListControl$uxDataView$ctl${indexString}$uxProductName`;
      // @ts-ignore
      document.querySelector('[name="__EVENTARGUMENT"]').value = '';
      document.forms[0].submit();
    }, indexString);
  }
}
