/* eslint-disable no-console, no-process-exit */
//https://www.dedicatedbrand.com/en/men/all-men#page=16

const fs = require("fs");
const dedicatedbrand = require('./eshops/dedicatedbrand');
const circlesportswear = require('./eshops/circlesportswear');
const montlimart = require('./eshops/montlimart');
//const { json } = require("express");
var gender = "";

function saveJson(obj){
  fs.writeFile("output.json", obj, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
  });
}

async function sandbox(eshop = 'https://www.dedicatedbrand.com/en/men/all-men?p=2', gender) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await dedicatedbrand.scrape(eshop, gender);

    console.log(products);
    console.log('done');
    console.log(products.length)
    return products;
    //process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function dedicatedDEDICATED(){
  var products = []
  gender = "men";
  for (let i = 1; i <= 16; i++) {
    link = "https://www.dedicatedbrand.com/en/men/all-men?p="+i
    /*
    console.log(`🕵️‍♀️  browsing ${link} eshop`);
    var partprod = dedicatedbrand.scrape(link)*/
    var partprod = sandbox(link, gender)
    var slices = await partprod
    products = products.concat(slices)
  }
  gender = "women";
  for (let i = 1; i <= 16; i++){
    link = "https://www.dedicatedbrand.com/en/women/all-women?p="+i
    var partprod = sandbox(link, gender)
    var slices = await partprod
    products = products.concat(slices)
  }
  
  console.log(products)
  console.log(products.length)
  return products
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

    console.log(products);
    console.log('done');
    //process.exit(0);
    return products;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function sandboxall (eshop1 = 'https://www.dedicatedbrand.com', eshop2 = 'https://shop.circlesportswear.com', eshop3 = 'https://www.montlimart.com/99-vetements') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop1} eshop`);

    const products = await dedicatedDEDICATED();

    console.log(products);
    console.log('done');

    console.log(`🕵️‍♀️  parse ${eshop2} eshop femmes`);
    gender = "women";
    const products2 = await circlesportswear.scrape('https://shop.circlesportswear.com/collections/collection-femme', gender);

    console.log(products2);
    console.log('done');

    console.log(`🕵️‍♀️  parse ${eshop2} eshop hommes`);
    gender = "men"
    const products2_2 = await circlesportswear.scrape('https://shop.circlesportswear.com/collections/collection-homme', gender);

    console.log(products2_2);
    console.log('done');

    console.log(`🕵️‍♀️  parse ${eshop3} eshop`);

    const products3 = await montlimart.scrape(eshop3, gender);

    console.log(products3);
    console.log('done');

    var allprods =  products.concat(products2).concat(products2_2).concat(products3);

    console.log(allprods.length)

    //console.log(objprods);

    //const jsonContent = JSON.stringify(objprods, null, 2);
    const jsonContent = JSON.stringify(allprods, null, 2);

    //console.log(jsonContent)

    fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
      if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
      }
   
      console.log("JSON file has been saved.");
    });
    
    return allprods;
    //process.exit(0);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}



const [,, eshop1, eshop2, eshop3] = process.argv;
//const [,, eshop] = process.argv;

//sandbox(eshop)

sandboxall(eshop1, eshop2, eshop3)

//sandbox3("https://www.montlimart.com/72-nouveautes");

//dedicatedDEDICATED()
