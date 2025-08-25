import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
const SELLERS_PER_PAGE = 50;
const EIS_CATEGORY_BASE_URL =
  'https://www.eis.gov.lv/EIS/Categories/SearchFaProducts.aspx?FaNumber=';
import { ConfigService } from 'src/config/config.service';
import {
  LOGIN_BUTTON_SELECTOR_ID,
  LOGIN_USERNAME_INPUT_SELECTOR_ID,
  LOGIN_PASSWORD_INPUT_SELECTOR_ID,
  LOGIN_CONTINUE_BUTTON,
  LOGIN_CODE_SPAN,
  LOGIN_CODE_INPUT,
  LOGIN_FINAL_BUTTON,
} from 'src/common/constants';
import {
  ICategory,
  IParseCategoryResult,
  IPrice,
  IOption,
  IUpdateEisCategory,
} from 'src/common/interfaces';
@Injectable()
export class ParserService {
  constructor(private readonly configService: ConfigService) {}

  private async loginToPage(page: any) {
    const url = 'https://www.eis.gov.lv';

    try {
        const cookiesPath = './cookies.json';
        let cookiesString = '';
      const credentialsConfig = await this.configService.getConfig();
        if (fs.existsSync(cookiesPath)) {
            cookiesString = fs.readFileSync(cookiesPath, 'utf-8');
        }
        if (cookiesString) {
            await page.setCookie(...JSON.parse(cookiesString));
        }
      await page.goto(url);
      const lb = await page.$(LOGIN_BUTTON_SELECTOR_ID);
      if (!lb) {
        Logger.log('Already logged in');
        return cookiesString;
      } else {
        Logger.log('Logging in');
      }
      await page.click(LOGIN_BUTTON_SELECTOR_ID);

      await page.waitForSelector("ctl00_uxAuthenticationBlock_uxLoginFormTable");

      await page.click("ctl00_uxAuthenticationBlock_uxLoginByLoginPassword");

      await page.waitForSelector("ctl00_uxAuthenticationBlock_uxLoginUpdatePanel");

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
      args: ['--no-sandbox'],
    });
    try {
      const eisData: Array<IParseCategoryResult> = [];
      let productId = '';
      let productName = '';
      const page = await browser.newPage();
      await this.loginToPage(page);
      const URL = EIS_CATEGORY_BASE_URL.concat(categoryId);
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
        const supplierNames = await page.evaluate(() => {
          const rows = document.querySelectorAll(
            '#ctl00_uxMainContent_uxFilteredProductListControl_uxDataView > tbody > tr:not(.contenttablehead) > td:nth-child(3)',
          );
          return Array.from(rows).map((el) => el.textContent.trim());
        });

        const blockedSuppliersRowIndex = await page.evaluate(() => {
          const rows = document.querySelectorAll(
            '[id$=_uxIconSupplierFaIsBlocked]',
          );
          return Array.from(rows).map((el) =>
            Number(el.id.match(/_ctl(\d+)_uxIconSupplierFaIsBlocked/)[1]),
          );
        });
        for (let k = 2; k <= numberOfSellers - i * SELLERS_PER_PAGE + 1; k++) {
          if (blockedSuppliersRowIndex.includes(k)) continue;
          await this.performPostBack(page, k);
          await page.waitForNavigation();
          const companyName = supplierNames[k - 2];
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
            const rows = document.querySelectorAll(
              '#ctl00_uxMainContent_uxFilteredProductListControl_uxProductEditControl_uxDiscounts > tbody > tr:not(.contenttablehead)',
            );
            return Array.from(rows).map((row) => {
              const tds = row.querySelectorAll('td');
              const amount = Number(tds[0].innerText);
              const discount = Number(Number(tds[1].innerText));
              if (amount > 0 && discount > 0) {
                return {
                  amount: amount.toString(),
                  discount: discount.toString(),
                };
              }
            });
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

        if (i !== numberOfPageIterations - 1) {
          await page.click(
            '#ctl00_uxMainContent_uxFilteredProductListControl_uxPagingControl_uxNextPage',
          );
          await page.waitForNavigation();
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
  public async updateCateogryInEis(dto: IUpdateEisCategory) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox'],
    });
    try {
      const page = await browser.newPage();
      const cookiesString = fs.readFileSync('./cookies.json', 'utf-8');
      await page.setCookie(...JSON.parse(cookiesString));
      const URL = EIS_CATEGORY_BASE_URL.concat(dto.categoryId);
      await page.goto(URL);
      // Filter our companys, our company is assigned by id = 2668.
      await page.select(
        '#ctl00_uxMainContent_uxFilteredProductListControl_uxSupplier',
        '2668',
      );
      await page.click(
        '#ctl00_uxMainContent_uxFilteredProductListControl_uxFilterButton',
      );
      await page.waitForFunction(() => {
        const tableRows = document.querySelectorAll(
          '#ctl00_uxMainContent_uxFilteredProductListControl_uxDataView >  tbody > tr',
        );
        // Check if there is only 2 rows in the table
        return tableRows.length === 2;
      });
      await this.performPostBack(page, 2);

      // wait for category edit popup to load
      await page.waitForSelector(
        '#ctl00_uxMainContent_uxFilteredProductListControl_uxProductEditControl_uxProductEditPopupPanel',
      );
      // Region prices
      dto.priceList.forEach((price, index) => {
        const selector = `#ctl00_uxMainContent_uxFilteredProductListControl_uxProductEditControl_uxPriceList_ctl0${
          index + 2
        }_uxPrice`;
        page.$eval(
          selector,
          (input, newValue) => ((input as HTMLInputElement).value = newValue),
          price.price.toString(),
        );
      });
      // Discounts
      dto.discounts.forEach((discount, index) => {
        if (!discount) return;
        const quantitySelector = `#ctl00_uxMainContent_uxFilteredProductListControl_uxProductEditControl_uxDiscounts_ctl0${
          index + 2
        }_uxCount`;

        const discountSelector = `#ctl00_uxMainContent_uxFilteredProductListControl_uxProductEditControl_uxDiscounts_ctl0${
          index + 2
        }_uxDiscount`;

        page.$eval(
          quantitySelector,
          (input, newValue) => ((input as HTMLInputElement).value = newValue),
          discount.amount.toString(),
        );
        page.$eval(
          discountSelector,
          (input, newValue) => ((input as HTMLInputElement).value = newValue),
          discount.discount.toString(),
        );
      });

      // Options
      const inputIds = await page.evaluate(() => {
        const textInputElements = Array.from(
          document.querySelectorAll(
            '#ctl00_uxMainContent_uxFilteredProductListControl_uxProductEditControl_uxEquipmentPriceListRow input[type="text"]',
          ),
        );
        return textInputElements.map((input) => input.id);
      });
      const flattendOptions = [];
      dto.options.forEach((option) => {
        if (option.subOptions) {
          flattendOptions.push(...option.subOptions);
        } else {
          flattendOptions.push(option);
        }
      });
      flattendOptions.forEach((option, index) => {
        const selector = `#${inputIds[index]}`;
        page.$eval(
          selector,
          (input, newValue) => ((input as HTMLInputElement).value = newValue),
          option.price.toString(),
        );
      });

      // Click save
      await page.click(
        '#ctl00_uxMainContent_uxFilteredProductListControl_uxProductEditControl_uxSaveButton',
      );
      await page.waitForFunction(
        (selector) => !document.querySelector(selector),
        {},
        '#ctl00_uxMainContent_uxFilteredProductListControl_uxProductEditControl_uxPopupContent',
      );
      return {
        status: HttpStatus.OK,
      };
    } catch (e) {
      Logger.error('Error updating category', e.message);
      throw new HttpException('Failed to update category in EIS system.', 202);
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
