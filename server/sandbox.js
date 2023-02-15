/* eslint-disable no-console, no-process-exit */

const dedicatedbrand = require('./eshops/dedicatedbrand');
const circlesportswear = require('./eshops/circlesportswear');
const montlimart = require('./eshops/montlimart')



async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await dedicatedbrand.scrape(eshop);

    console.log(products);
    console.log('done');
    //process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function sandbox2 (eshop = 'https://shop.circlesportswear.com/collections/collection-femme') {
  try {
    console.log(`🕵️‍♀️  parse ${eshop} eshop`);

    const products = await circlesportswear.scrape(eshop);

    console.log(products);
    console.log('done');
    //process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function sandbox3 (eshop = 'https://www.montlimart.com/99-vetements') {
  try {
    console.log(`🕵️‍♀️  parse ${eshop} eshop`);

    const products = await montlimart.scrape(eshop);

    console.log(products);
    console.log('done');
    //process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function sandboxall (eshop1 = 'https://www.dedicatedbrand.com/en/men/news', eshop2 = 'https://shop.circlesportswear.com/collections/collection-femme', eshop3 = 'https://www.montlimart.com/99-vetements') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop1} eshop`);

    const products = await dedicatedbrand.scrape(eshop1);

    console.log(products);
    console.log('done');

    console.log(`🕵️‍♀️  parse ${eshop2} eshop`);

    const products2 = await circlesportswear.scrape(eshop2);

    console.log(products2);
    console.log('done');

    console.log(`🕵️‍♀️  parse ${eshop3} eshop`);

    const products3 = await montlimart.scrape(eshop3);

    console.log(products3);
    console.log('done');
    process.exit(0);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;


//sandbox(eshop);
//sandbox2(eshop);
sandbox3(eshop);


//sandboxall(eshop1, eshop2, echop3)
