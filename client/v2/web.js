/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
    try {
      const response = await fetch(
        `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
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