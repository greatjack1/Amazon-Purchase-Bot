import Cheerio from 'cheerio';
import { OOS_IN_STOCK_SOON, OUT_OF_STOCK } from './constants';

export function parsePriceAndAvailabilityOfItem(body: string) {
  //Selectors to find the price
  const selectors = [
    '#corePrice_desktop > div > table > tbody > tr:nth-child(1) > td.a-span12 > span.a-price.a-text-price.a-size-medium.apexPriceToPay > span.a-offscreen',
    '#corePrice_desktop > div > table > tbody > tr:nth-child(2) > td.a-span12 > span.a-price.a-text-price.a-size-medium.apexPriceToPay > span.a-offscreen',
    '#availability > span',
    '#priceblock_ourprice',
  ];
  const dom = Cheerio.load(body);
  const node = selectors
    .map((selector) => dom(selector))
    .find((node) => node.length);

  if (!node) {
    return 'No price or availability found, are you trying it on a supported product?';
  }

  let text = node.text();
  text = text.replace('$', '').toLowerCase();
  if (text.includes('currently unavailable')) {
    return OUT_OF_STOCK;
  } else if (text.includes('in stock soon')) {
    return OOS_IN_STOCK_SOON;
  }
  return text.trim();
}

export function parseBuyNowFormData(body: string) {
  const ids = [
    'CSRF',
    'anti-csrftoken-a2z',
    'offerListingID',
    'session-id',
    'ASIN',
    'isMerchantExclusive',
    'merchantID',
    'isAddon',
    'nodeID',
    'sellingCustomerID',
    'qid',
    'sr',
    'storeID',
    'tagActionCode',
    'viewID',
    'rebateId',
    'ctaDeviceType',
    'ctaPageType',
    'usePrimeHandler',
    'rsid',
    'sourceCustomerOrgListID',
    'sourceCustomerOrgListItemID',
    'wlPopCommand',
    'submit.buy-now',
    'dropdown-selection',
    'dropdown-selection-ubb',
  ];
  //load the whole body from the page to start
  let dom = Cheerio.load(body);

  //extract the addtocart html so we can get the form data for buy it now
  const addToCartHtml = dom('#addToCart').html();
  if (addToCartHtml === null) {
    console.log('No form html available when adding to card, aborting....');
    throw new Error(
      'Could not parse form data, are you being soft banned (captcha) by amazon?'
    );
  }

  //Load the extracted add to cart html
  dom = Cheerio.load(addToCartHtml);
  const formData: Record<string, string> = {};
  //extract the needed form data
  ids.forEach((id) => {
    const nodeText = dom('[name=' + id + ']').attr('value');
    const value = nodeText ? nodeText : '';
    formData[id] = value;
  });
  return formData;
}

export function parsePurchaseFormData(body: string) {
  const ids = [
    'purchaseLevelMessageIds',
    'submitFromSPC',
    'fasttrackExpiration',
    'countdownThreshold',
    'showSimplifiedCountdown',
    'countdownId',
    'quantity',
    'dupOrderCheckArgs',
    'order0',
    'shippingofferingid0.0',
    'guaranteetype0.0',
    'issss0.0',
    'shipsplitpriority0.0',
    'isShipWhenCompleteValid0.0',
    'isShipWheneverValid0.0',
    'shippingofferingid0.1',
    'guaranteetype0.1',
    'issss0.1',
    'shipsplitpriority0.1',
    'isShipWhenCompleteValid0.1',
    'isShipWheneverValid0.1',
    'previousshippingofferingid0',
    'previousguaranteetype0',
    'previousissss0',
    'previousshippriority0',
    'lineitemids0',
    'currentshippingspeed',
    'previousShippingSpeed0',
    'currentshipsplitpreference',
    'shippriority.0.shipWhenever',
    'groupcount',
    'shiptrialprefix',
    'csrfToken',
    'fromAnywhere',
    'redirectOnSuccess',
    'purchaseTotalCurrency',
    'purchaseID',
    'purchaseCustomerId',
    'useCtb',
    'scopeId',
    'isQuantityInvariant',
    'promiseTime-0',
    'promiseAsin-0',
    'selectedPaymentPaystationId',
    'hasWorkingJavascript=1',
    'placeYourOrder1',
    'isfirsttimecustomer',
    'isTFXEligible',
    'isFxEnabled',
    'isFXTncShown',
  ];

  //Load the purchase page html
  let dom = Cheerio.load(body);

  //Extract out the purchase button form data html
  const purchaseHtml = dom('#spc-form').html();
  if (purchaseHtml === null) {
    console.log('No form html available, aborting....');
    throw new Error(
      'Could not parse form data, are you being soft banned (captcha) by amazon?'
    );
  }

  //Load the form data html
  dom = Cheerio.load(purchaseHtml);
  const formData: Record<string, string> = {};
  //go through all the ids and map them to the form data
  ids.forEach((id) => {
    //the quantity parameter depends on the item id, so let's handle that special case here
    if (id === 'quantity') {
      const itemId = dom('[name=lineitemids0]').attr('value');
      formData[id + '.' + itemId] = '1';
    } else {
      const nodeText = dom('[name=' + id + ']').attr('value');
      const value = nodeText ? nodeText : '';
      formData[id] = value;
    }
  });
  return formData;
}
