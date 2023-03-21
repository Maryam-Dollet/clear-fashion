// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

let currentProducts = [];
let currentPagination = {};
let currentBrands = [];

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async () => {
  try {
    const response = await fetch(
     `https://clear-fashion-topaz-seven.vercel.app/products`
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

const fetchBrands = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-topaz-seven.vercel.app/brands`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentBrands};
    }

    return body.data.result;
  } catch (error) {
    console.error(error);
    return {currentBrands};
  }
};

const renderBrands = brands => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = brands
    .map(product => {
      return `
      <div>
        ${product}
      </div>
     `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

document.addEventListener('DOMContentLoaded', async () => {
  //const products = await fetchProducts();
  const brands = await fetchBrands();

  

});

