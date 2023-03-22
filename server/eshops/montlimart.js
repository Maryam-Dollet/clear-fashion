const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = (data, selectedGender) => {
    const $ = cheerio.load(data);
  
    return $('.products-list .products-list__block')
      .map((i, element) => {
        const name = $(element)
          .find('.text-reset')
          .text()
          .trim()
          .replace(/\s/g, ' ')
          .toLowerCase();
        const price = parseInt(
          $(element)
            .find('.price')
            .text()
        );

        let image = $(element)
          .find('.product-miniature__thumb')
          .find('img')
          .attr('data-src')
        
        if (image == null){
          image = $(element)
          .find('.product-miniature__thumb')
          .find('source').eq(1)
          .attr('src')
        }

        const link = $(element)
        .find('.product-miniature__title')
        .children('a')
        .attr('href')

        const brand = "montlimart"

        const gender = selectedGender;

        const datelist = ["2023-02-24","2023-02-18","2023-02-05","2023-03-03","2023-03-07"];
        const random = Math.floor(Math.random() * datelist.length);
        const date = datelist[random];
  
        return {name, price, image, brand,gender, date, link};
      })
      .get();
  };
  
  /**
   * Scrape all the products for a given url page
   * @param  {[type]}  url
   * @return {Array|null}
   */
  module.exports.scrape = async (url, gender) => {
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