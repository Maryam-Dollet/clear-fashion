const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = (data, selectedGender) => {
  const $ = cheerio.load(data);

  return $('.productList-container .productList')
    .map((i, element) => {
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );
      const image = $(element)
        .find('.productList-image')
        .children('img')
        .attr('data-src')
      
      const link = 'https://www.dedicatedbrand.com' + $(element)
        .find('.productList-link')
        .attr('href')

      const brand = "dedicated"

      const gender = selectedGender

      const datelist = ["2023-02-24","2023-02-18","2023-02-05","2023-03-03","2023-03-07"];
      const random = Math.floor(Math.random() * datelist.length);
      const date = datelist[random];

      return {name, price, image,brand,gender, date,link};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async (url,gender) => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body, gender);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
