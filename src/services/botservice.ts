import {
  getItem,
  postBuyNowButton,
  postPlaceOrderButton,
} from '../utilities/requests';
import {
  parseBuyNowFormData,
  parsePurchaseFormData,
  parsePriceAndAvailabilityOfItem,
} from '../utilities/parser';
import Item from '../models/item';

export async function getPriceAndAvailability(item: Item) {
  const itemHtml = await getItem(item.url);
  const availabilityInfo = parsePriceAndAvailabilityOfItem(itemHtml);
  return availabilityInfo;
}

export async function purchaseItem(item: Item) {
  const itemHtml = await getItem(item.url);
  const formData = parseBuyNowFormData(itemHtml);
  const buyNowHtml = await postBuyNowButton(
    'https://www.amazon.com/gp/product/handle-buy-box/ref=dp_start-bbf_1_glance',
    formData
  );
  const purchaseFormData = parsePurchaseFormData(buyNowHtml);
  const result = await postPlaceOrderButton(
    'https://www.amazon.com/gp/buy/spc/handlers/static-submit-decoupled.html/ref=ox_spc_place_order?ie=UTF8&hasWorkingJavascript=',
    purchaseFormData
  );
  return result;
}
