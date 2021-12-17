import axios from 'axios';
import tough from 'tough-cookie';
import querystring from 'querystring';

import { PURCHASE_FAILURE, PURCHASE_SUCCESS } from './constants';

//We use a cookie jar to persist cookies and session state between requests
const cookieJar = new tough.CookieJar();

//Definitely would use env variables in prod, but since the focus of this project is to show reverse engineering skills, just ditch it...
//Fill in the following cookies, they can be obtained by viewing the cookies sent back from amazon on a login request
const loginCookies = [
  'ap-fid=""; Domain=.amazon.com; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/ap/; Secure',
  'x-main=""; Domain=.www.amazon.com; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure',
  'session-id=""; Domain=.www.amazon.com; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure',
  'session-token=""; Domain=.www.amazon.com; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure',
  'session-id-time=""; Domain=.www.amazon.com; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure',
  'ubid-main=""; Domain=.www.amazon.com; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure',
  'at-main=""; Domain=.www.amazon.com; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure',
  'sess-at-main=""; Domain=.www.amazon.com; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure',
  'i18n-prefs=deleted; Domain=.amazon.com; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure',
  'session-id=146-1235430-3343642; Domain=.amazon.com; Expires=Sat, 10-Dec-2022 16:19:17 GMT; Path=/; Secure',
  'session-id-time=2269873157l; Domain=.amazon.com; Expires=Sat, 10-Dec-2022 16:19:17 GMT; Path=/; Secure',
  'ubid-main=130-1639574-0559309; Domain=.amazon.com; Expires=Sat, 10-Dec-2022 16:19:17 GMT; Path=/; Secure',
  'session-token=',
  'x-main=',
  'at-main=',
  'sess-at-main=',
  'sst-main=',
  'lc-main=en_US; Domain=.amazon.com; Expires=Sat, 10-Dec-2022 16:19:17 GMT; Path=/; Secure',
];
//init the starting cookies into the cookie store
loginCookies.forEach((cookie) => {
  cookieJar.setCookieSync(cookie, 'https://www.amazon.com/ap/signin');
});

export async function getItem(path: string) {
  const cookies = await getCookies(path);
  const config = {
    withCredentials: true,
    headers: {
      host: 'www.amazon.com',
      connection: 'keep-alive',
      cookie: cookies,
      'cache-control': 'max-age=0',
      'sec-ch-ua':
        '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
      'sec-ch-ua-mobile': '?0',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'sec-fetch-site': 'none',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-user': '?1',
      'sec-fetch-dest': 'document',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
    },
  };

  const response = await axios.get(path, config);
  response.headers['set-cookie'] &&
    storeCookies(response.headers['set-cookie'], path);
  return response.data;
}

export async function postBuyNowButton(
  path: string,
  formData: Record<string, string>
) {
  const cookies = await getCookies(path);
  const formDataString = querystring.stringify(formData);
  const options = {
    headers: {
      host: 'www.amazon.com',
      connection: 'keep-alive',
      'cache-control': 'max-age=0',
      rtt: '50',
      downlink: '10',
      ect: '4g',
      'sec-ch-ua':
        '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
      'sec-ch-ua-mobile': '?0',
      'upgrade-insecure-requests': '1',
      origin: 'https://www.amazon.com',
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-user': '?1',
      'sec-fetch-dest': 'document',
      referer:
        'https://www.amazon.com/Leviton-1-Gang-Duplex-Receptacle-Wallplate/dp/B000U3DZRC/?_encoding=UTF8&pd_rd_w=bx3Rm&pf_rd_p=29505bbf-38bd-47ef-8224-a5dd0cda2bae&pf_rd_r=B18XSXMTNQK6333QE00M&pd_rd_r=476c7ed6-9b28-4a9a-92f9-886b528c69c1&pd_rd_wg=i7VWJ&ref_=pd_gw_ci_mcx_mr_hp_atf_m',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
      cookie: cookies,
    },
  };

  const response = await axios.post(path, formDataString, options);
  response.headers['set-cookie'] &&
    storeCookies(response.headers['set-cookie'], path);
  return response.data;
}

export async function postPlaceOrderButton(
  path: string,
  formData: Record<string, string>
) {
  const cookies = await getCookies(path);
  const formDataString = querystring.stringify(formData);
  const options = {
    headers: {
      host: 'www.amazon.com',
      connection: 'keep-alive',
      'cache-control': 'max-age=0',
      rtt: '0',
      downlink: '10',
      ect: '4g',
      'sec-ch-ua':
        '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
      'sec-ch-ua-mobile': '?0',
      'upgrade-insecure-requests': '1',
      origin: 'https://www.amazon.com',
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-user': '?1',
      'sec-fetch-dest': 'document',
      referer:
        'https://www.amazon.com/gp/buy/spc/handlers/display.html?hasWorkingJavascript=1',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
      cookie: cookies,
    },
  };

  const response = await axios.post(path, formDataString, options);
  response.headers['set-cookie'] &&
    storeCookies(response.headers['set-cookie'], path);
  if (response.headers['x-amz-checkout-page-type'] === 'CheckoutThankYou') {
    return PURCHASE_SUCCESS;
  } else {
    return PURCHASE_FAILURE;
  }
}

function storeCookies(cookieHeaders: string[], path: string) {
  cookieHeaders.forEach((cookie) => {
    cookieJar.setCookieSync(cookie, path);
  });
}

async function getCookies(path: string) {
  return cookieJar.getCookieString(path);
}
