// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';



/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://clear-fashion-63uk4zzaz-maryamdollet-gmailcom.vercel.app/products`
      );
      const body = await response.json();
  
      if (body.success !== true) {
        console.error(body);
        return {currentProducts, currentPagination};
      }
  
      return body.data;
    } catch (error) {
      console.error(error);
      return {currentProducts, currentPagination};
    }
  };