import { getPriceAndAvailability, purchaseItem } from './services/botservice';
import {
  OOS_IN_STOCK_SOON,
  OUT_OF_STOCK,
  PURCHASE_SUCCESS,
} from './utilities/constants';
import Item from './models/item';

async function checkItems() {
  console.log('Starting to check items status......');
  // Add items here
  const items = [
    //out of stock item to check
    {
      url: 'https://www.amazon.com/PlayStation-5-Console/dp/B09DFCB66S',
      isOOS: true,
    },
  ];
  const promises = items.map(checkItem);
  console.log('Waiting for all checking to finish...');
  try {
    await Promise.all(promises);
  } catch (e) {
    console.log(
      'We encountered an error when checking items!! Will retry in 30 seconds'
    );
  }
  //Wait 30 seconds after finishing to check before checking again
  console.log('Finished checking items, will restart in 30 seconds...');
  setTimeout(checkItems, 30000);
}

async function checkItem(item: Item) {
  const itemResult = await getPriceAndAvailability(item);
  if (itemResult === OUT_OF_STOCK || itemResult === OOS_IN_STOCK_SOON) {
    console.log(item.url + ' is Out of stock');
  } else {
    console.log(item.url + 'costs $' + itemResult);
    //If the item was submitted as being out of stock, then purchase the item
    if (item.isOOS) {
      console.log(
        'Detected out of stock item as now in stock, pruchasing.....'
      );
      const result = await purchaseItem(item);
      if (result === PURCHASE_SUCCESS) {
        console.log('Purchased - ' + item.url);
        //quit the program since we purchased the out of stock item
        process.exit();
      } else {
        console.log('Failed to purchase - ' + item.url);
      }
    }
  }
}

checkItems();
