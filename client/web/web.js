// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

let currentProducts = [];
let currentPagination = {};
let currentBrands = [];

// instantiate the selectors
const sectionBrands = document.querySelector('#brands');
const sectionProducts = document.querySelector('#products');

const setCurrentBrands = (result) => {
  result.unshift("");
  currentBrands = result;
}

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
  
    return body;

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

    return body;

  } catch (error) {
    console.error(error);
    return {currentBrands};
  }
};

const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product._id}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
     `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

const renderBrands = brands => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = brands
    .map(brand => {
      return `
      <div>
        ${brand}
      </div>
     `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionBrands.innerHTML = '<h2>Brands</h2>';
  sectionBrands.appendChild(fragment);
};

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  console.log(products)

  const brands = await fetchBrands();
  console.log(brands)
  setCurrentBrands(brands)
  renderBrands(brands)
  renderProducts(products)
  

});

