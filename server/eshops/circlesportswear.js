const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = (data, selectedGender) => {
    const $ = cheerio.load(data);
  
    return $('.product-grid-container .grid__item')
      .map((i, element) => {
        let name = $(element)
          .find('.full-unstyled-link')
          .text()
          .trim()
          .replace(/\s/g, ' ')
        
        name = Array.from(new Set(name.split(' '))).join(' ').slice(0, -1)
        //name = name.toString()
        let price = $(element)
            .find('.money')
            .text()
            .replace(/€/g, ' ')
        
        price = Array.from(new Set(price.split(' '))).join(' ').replace(' ','')

        price = parseInt(price)

        let image = $(element)
          .find('.media')
          .children('img')
          .attr('srcset')
        
        image = image.split(',')[1].split(' ')[0]
        image = "https:" + image;
        
        const link = "https://shop.circlesportswear.com"+$(element)
        .find('.card__heading')
        .children('a')
        .attr('href')

        const brand = "circlesportswear"

        const gender = selectedGender;

        const datelist = ["2023-02-24","2023-02-18","2023-02-05","2023-03-03","2023-03-07"];
        const random = Math.floor(Math.random() * datelist.length);
        const date = datelist[random];
  
        return {name, price, image, brand, gender, date, link};
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