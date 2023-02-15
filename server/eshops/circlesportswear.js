const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
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

        let image = $(element)
          .find('.media')
          .children('img')
          .attr('srcset')
        
        image = image.split(',')[1].split(' ')[0]
        
        const url = "https://shop.circlesportswear.com"+$(element)
        .find('.card__heading')
        .children('a')
        .attr('href')

  
        return {name, price, image, url};
      })
      .get();
  };
  
  /**
   * Scrape all the products for a given url page
   * @param  {[type]}  url
   * @return {Array|null}
   */
  module.exports.scrape = async url => {
    try {
      const response = await fetch(url);
  
      if (response.ok) {
        const body = await response.text();
  
        return parse(body);
      }
  
      console.error(response);
  
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };