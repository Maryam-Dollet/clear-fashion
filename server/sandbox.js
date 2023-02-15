/* eslint-disable no-console, no-process-exit */

const FileSystem = require("fs");
const dedicatedbrand = require('./eshops/dedicatedbrand');
const circlesportswear = require('./eshops/circlesportswear');
const montlimart = require('./eshops/montlimart');
const { json } = require("express");

function saveJson(obj){
  FileSystem.writeFile('products.json', JSON.stringify(obj), 'utf8', (error) => {
    if (error) throw error;
  });
}

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await dedicatedbrand.scrape(eshop);

    //console.log(products);
    console.log('done');
    return products;
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

    //console.log(products);
    console.log('done');
    return products;
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

    //console.log(products);
    console.log('done');
    //process.exit(0);
    return products;
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

    var allprods =  products.concat(products2).concat(products3);

    var objprods = {}

    objprods.products = allprods

    //console.log(objprods);

    const jsonContent = JSON.stringify(objprods, null, 2);

    //console.log(jsonContent)

    FileSystem.writeFile("output.json", jsonContent, 'utf8', function (err) {
      if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
      }
   
      console.log("JSON file has been saved.");
    });

    process.exit(0);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop1, eshop2, eshop3] = process.argv;

/*
const prods1 = sandbox(eshop);
let prods2 = sandbox2(eshop);
let prods3 = sandbox3(eshop);

console.log(prods1);
*/
sandboxall(eshop1, eshop2, eshop3)
